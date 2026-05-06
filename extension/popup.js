// =============================================================
//  VirusTotal URL Scanner — popup logic
// =============================================================
//
// IMPORTANT: Replace the placeholder below with your VirusTotal API key.
// Get a free key at: https://www.virustotal.com/gui/my-apikey
//
// ⚠️ SECURITY NOTE
// In a production extension you should NEVER ship an API key in client code.
// The recommended pattern is to call your own backend proxy that holds the
// key server-side and forwards requests to VirusTotal. This file keeps the
// key client-side only for demo / personal-use simplicity.
// =============================================================

const API_KEY = "YOUR_API_KEY_HERE";
const VT_BASE = "https://www.virustotal.com/api/v3";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ---------- DOM ----------
const urlEl       = document.getElementById("current-url");
const scanBtn     = document.getElementById("scan-btn");
const statusEl    = document.getElementById("status");
const statusIcon  = document.getElementById("status-icon");
const statusText  = document.getElementById("status-text");
const statsEl     = document.getElementById("stats");
const sMalicious  = document.getElementById("stat-malicious");
const sSuspicious = document.getElementById("stat-suspicious");
const sHarmless   = document.getElementById("stat-harmless");

let currentTabId = null;
let currentUrl   = null;

// ---------- Helpers ----------

/** Get the active tab in the current window. */
async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

/** VirusTotal expects the URL identifier as base64url without padding. */
function urlToVtId(url) {
  // btoa works on binary strings; encodeURIComponent → UTF-8 safe.
  const b64 = btoa(unescape(encodeURIComponent(url)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function setStatus(kind, icon, text) {
  statusEl.className = `status ${kind}`;
  statusIcon.textContent = icon;
  statusIcon.className = "status-icon" + (kind === "loading" ? " spin" : "");
  statusText.textContent = text;

  // Update toolbar badge via background worker.
  chrome.runtime.sendMessage({ type: "VT_STATUS", status: kind, tabId: currentTabId });
}

function showStats({ malicious = 0, suspicious = 0, harmless = 0 } = {}) {
  sMalicious.textContent  = malicious;
  sSuspicious.textContent = suspicious;
  sHarmless.textContent   = harmless;
  statsEl.classList.remove("hidden");
}

function hideStats() {
  statsEl.classList.add("hidden");
}

function isScannableUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

// ---------- Cache ----------

async function getCached(url) {
  const key = `vt:${url}`;
  const obj = await chrome.storage.local.get(key);
  const entry = obj[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL_MS) return entry.stats;
  return null;
}

async function setCached(url, stats) {
  await chrome.storage.local.set({ [`vt:${url}`]: { ts: Date.now(), stats } });
}

// ---------- VirusTotal API ----------

async function vtSubmitUrl(url) {
  const res = await fetch(`${VT_BASE}/urls`, {
    method: "POST",
    headers: {
      "x-apikey": API_KEY,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: `url=${encodeURIComponent(url)}`,
  });
  if (res.status === 429) throw new Error("Rate limit reached. Please wait a minute and retry.");
  if (!res.ok) throw new Error(`Submit failed (${res.status})`);
  const json = await res.json();
  return json.data.id; // analysis id
}

async function vtGetAnalysis(analysisId) {
  const res = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
    headers: { "x-apikey": API_KEY },
  });
  if (res.status === 429) throw new Error("Rate limit reached. Please wait a minute and retry.");
  if (!res.ok) throw new Error(`Analysis fetch failed (${res.status})`);
  return res.json();
}

/** Try fetching a cached VT report by URL id (avoids re-scanning known URLs). */
async function vtGetUrlReport(url) {
  const id = urlToVtId(url);
  const res = await fetch(`${VT_BASE}/urls/${id}`, {
    headers: { "x-apikey": API_KEY },
  });
  if (res.status === 404) return null; // not yet scanned by VT
  if (res.status === 429) throw new Error("Rate limit reached. Please wait a minute and retry.");
  if (!res.ok) throw new Error(`Report fetch failed (${res.status})`);
  const json = await res.json();
  return json.data?.attributes?.last_analysis_stats ?? null;
}

/** Poll the analysis endpoint until status === "completed". */
async function pollAnalysis(analysisId, { tries = 10, delayMs = 1500 } = {}) {
  for (let i = 0; i < tries; i++) {
    const data = await vtGetAnalysis(analysisId);
    const attr = data?.data?.attributes;
    if (attr?.status === "completed") return attr.stats;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error("Analysis timed out. Try again shortly.");
}

// ---------- Verdict ----------

function verdictFromStats(stats) {
  const m = stats.malicious || 0;
  const s = stats.suspicious || 0;
  if (m > 0) return { kind: "malicious", icon: "🔴", text: `Malicious — ${m} engine(s) flagged this URL` };
  if (s > 0) return { kind: "suspicious", icon: "🟡", text: `Suspicious — ${s} engine(s) raised concerns` };
  return { kind: "safe", icon: "🟢", text: "Safe — no engines flagged this URL" };
}

// ---------- Main flow ----------

async function scanCurrentUrl() {
  if (!currentUrl) return;
  if (!isScannableUrl(currentUrl)) {
    setStatus("error", "⚠️", "This page can't be scanned (only http/https URLs).");
    hideStats();
    return;
  }
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    setStatus("error", "🔑", "Missing API key. Edit popup.js and set API_KEY.");
    hideStats();
    return;
  }

  scanBtn.disabled = true;
  hideStats();
  setStatus("loading", "⏳", "Analyzing…");

  try {
    // 1. Check local cache first.
    const cached = await getCached(currentUrl);
    if (cached) {
      const v = verdictFromStats(cached);
      setStatus(v.kind, v.icon, v.text + " (cached)");
      showStats(cached);
      return;
    }

    // 2. Try existing VT report (no submission needed if already known).
    let stats = await vtGetUrlReport(currentUrl).catch(() => null);

    // 3. Otherwise submit + poll.
    if (!stats) {
      const analysisId = await vtSubmitUrl(currentUrl);
      stats = await pollAnalysis(analysisId);
    }

    await setCached(currentUrl, stats);
    const v = verdictFromStats(stats);
    setStatus(v.kind, v.icon, v.text);
    showStats(stats);
  } catch (err) {
    console.error("[VT]", err);
    setStatus("error", "⚠️", err.message || "Something went wrong.");
    hideStats();
  } finally {
    scanBtn.disabled = false;
  }
}

// ---------- Init ----------

(async function init() {
  try {
    const tab = await getActiveTab();
    currentTabId = tab?.id ?? null;
    currentUrl = tab?.url ?? "";
    urlEl.textContent = currentUrl || "(no URL available)";
    urlEl.title = currentUrl || "";

    if (!isScannableUrl(currentUrl)) {
      setStatus("error", "⚠️", "Open a regular http(s) page to scan it.");
      scanBtn.disabled = true;
    }
  } catch (err) {
    setStatus("error", "⚠️", "Could not read current tab.");
    scanBtn.disabled = true;
  }
})();

scanBtn.addEventListener("click", scanCurrentUrl);