console.log("Background script running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.captureMode !== undefined) {
    const iconPath = message.captureMode
      ? "icons/active-icon.png"
      : "icons/inactive-icon.png";
    chrome.action.setIcon({ path: iconPath });
    console.log("Icon path set to:", iconPath);
  }

  if (message.action && message.content !== undefined) {
    chrome.storage.local.set({ capturedContent: message.content }, () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("capture.html") });
    });
  }
});
