// background.js
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "open_popup" && sender.tab) {
      chrome.action.openPopup();
    }
  });
  