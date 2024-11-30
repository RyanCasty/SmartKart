// checkout.js
function extractPurchaseInfo() {
    let items = [];
    
    // Extract items from the checkout page
    document.querySelectorAll('.a-row.sc-list-item').forEach(item => {
      const title = item.querySelector('.sc-product-title')?.innerText.trim();
      const price = item.querySelector('.sc-product-price')?.innerText.trim();
      const quantity = item.querySelector('.a-dropdown-prompt')?.innerText.trim();
  
      if (title && price) {
        items.push({ title, price, quantity });
      }
    });
  
    // Extract the total price using the correct selector
    let totalElement = document.querySelector('.grand-total-price');
    let total = totalElement ? totalElement.textContent.trim() : 'Total not found';
  
    const purchaseInfo = {
      items: items,
      total: total,
    };
  
    console.log(purchaseInfo);
    
    // Send the data to the background script
    chrome.runtime.sendMessage({ action: 'purchase_info', data: purchaseInfo });
  }
  
  function pollForTotalPrice(maxRetries = 20, delay = 500) {
    let retries = 0;
  
    const intervalId = setInterval(() => {
      const totalElement = document.querySelector('.grand-total-price');
  
      if (totalElement || retries >= maxRetries) {
        if (totalElement) {
          extractPurchaseInfo();
        } else {
          console.error('Failed to find total price element after maximum retries.');
        }
        clearInterval(intervalId); // Stop polling
      }
  
      retries++;
    }, delay);
  }
  
  // Start polling for the total price element after the page loads
  window.addEventListener('load', () => {
    pollForTotalPrice();
  });
  