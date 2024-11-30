// background.js
let purchaseInfo = null;

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'purchase_info') {
    purchaseInfo = message.data; // Store the purchase information
  }
});

// Make the purchase info available to the popup when requested
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'get_purchase_info') {
    sendResponse(purchaseInfo);
  }
});
