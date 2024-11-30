// popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Request purchase info from the background script
    chrome.runtime.sendMessage({ action: 'get_purchase_info' }, (response) => {
      const purchaseInfoDiv = document.getElementById('purchase-info');
  
      if (response) {
        let htmlContent = '';
  
        response.items.forEach(item => {
          htmlContent += `
            <div class="item">
              <strong>${item.title}</strong><br>
              Price: ${item.price}<br>
              Quantity: ${item.quantity}
            </div>
          `;
        });
  
        htmlContent += `<strong>Total: ${response.total}</strong>`;
        purchaseInfoDiv.innerHTML = htmlContent;
      } else {
        purchaseInfoDiv.innerText = 'No purchase information available.';
      }
    });
  });
  