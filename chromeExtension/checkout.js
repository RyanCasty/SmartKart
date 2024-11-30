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
    let total = totalElement ? totalElement.innerText.trim() : 'Total not found';
  
    // Collect all the purchase information
    const purchaseInfo = {
      items: items,
      total: total,
    };
  
    console.log(purchaseInfo);
    
    // Send the data to the background script
    chrome.runtime.sendMessage({ action: 'purchase_info', data: purchaseInfo });
  }
  
  // Run the extraction after the page has fully loaded
  window.addEventListener('load', () => {
    // Set a timeout to give time for elements to load dynamically (adjust as needed)
    setTimeout(extractPurchaseInfo, 2000);
  });
  