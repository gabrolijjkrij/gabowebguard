// Background service worker.
// Updates the toolbar badge color/text based on the latest scan result
// broadcast from popup.js via chrome.runtime.sendMessage.

const COLORS = {
  safe:       "#10b981",
  suspicious: "#f59e0b",
  malicious:  "#ef4444",
  error:      "#6b7280",
  loading:    "#3b82f6",
};

const LABELS = {
  safe: "OK",
  suspicious: "!",
  malicious: "X",
  error: "?",
  loading: "…",
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "VT_STATUS" && msg.status) {
    const tabId = msg.tabId;
    const text = LABELS[msg.status] ?? "";
    const color = COLORS[msg.status] ?? "#6b7280";

    chrome.action.setBadgeBackgroundColor({ color, ...(tabId ? { tabId } : {}) });
    chrome.action.setBadgeText({ text, ...(tabId ? { tabId } : {}) });
  }
  sendResponse?.({ ok: true });
  return true;
});

// Clear badge when navigating to a new page.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setBadgeText({ text: "", tabId });
  }
});