// =============================================================
//  Gabo's WebGuard — popup logic
// =============================================================
//
// ⚠️ SECURITY NOTE
// In a production extension you should NEVER ship an API key in client code.
// The recommended pattern is to call your own backend proxy that holds the
// key server-side. This file keeps the key client-side for personal use.
// =============================================================

const API_KEY = "8b0106f081ee2efa619cfae089f63afebe028945d39756fc22cdc75d40967452";
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
  // Re-trigger animation
  statusEl.classList.remove("animate-in");
  void statusEl.offsetWidth;
  statusEl.classList.add("animate-in");
}

function showStats({ malicious = 0, suspicious = 0, harmless = 0 } = {}) {
  sMalicious.textContent  = malicious;
  sSuspicious.textContent = suspicious;
  sHarmless.textContent   = harmless;
  statsEl.classList.remove("hidden");
  statsEl.classList.remove("animate-in");
  void statsEl.offsetWidth;
  statsEl.classList.add("animate-in");
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
  if (!API_KEY) {
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
    await pushHistory(currentUrl, stats);
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

// ---------- History ----------
const HIST_KEY = "vt:history";
async function pushHistory(url, stats) {
  const v = verdictFromStats(stats);
  const obj = await chrome.storage.local.get(HIST_KEY);
  const list = obj[HIST_KEY] || [];
  list.unshift({ url, kind: v.kind, ts: Date.now(), stats });
  await chrome.storage.local.set({ [HIST_KEY]: list.slice(0, 50) });
  if (document.querySelector('.tab[data-panel="history"].active')) renderHistory();
}
async function renderHistory() {
  const obj = await chrome.storage.local.get(HIST_KEY);
  const list = obj[HIST_KEY] || [];
  const el = document.getElementById("history-content");
  if (!list.length) { el.innerHTML = '<div class="history-empty">No scans yet.<br>Scan a page to see it here.</div>'; return; }
  const fmt = (ts) => {
    const d = Date.now() - ts;
    if (d < 60000) return "just now";
    if (d < 3600000) return Math.floor(d / 60000) + "m ago";
    if (d < 86400000) return Math.floor(d / 3600000) + "h ago";
    return new Date(ts).toLocaleDateString();
  };
  el.innerHTML =
    '<div class="history-list">' +
    list.map((h) => `
      <div class="hist-item">
        <div class="hist-dot ${h.kind}"></div>
        <div class="hist-info">
          <div class="hist-url" title="${h.url}">${h.url}</div>
          <div class="hist-time">${fmt(h.ts)}</div>
        </div>
      </div>
    `).join("") +
    '</div>' +
    '<button class="hist-clear" id="hist-clear">Clear history</button>';
  document.getElementById("hist-clear").onclick = async () => {
    await chrome.storage.local.remove(HIST_KEY);
    renderHistory();
  };
}

// ---------- Tabs ----------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const panel = document.getElementById("panel-" + tab.dataset.panel);
    panel.classList.add("active");
    if (tab.dataset.panel === "history") renderHistory();
  });
});