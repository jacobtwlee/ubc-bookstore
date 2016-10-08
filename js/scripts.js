
/* Global variables */
var cart = {}
var products = {}
var inactiveTime = 0;

// Display the cart contents to the user
// Each item is presented in its own alert with a gap of 5 seconds between each alert
function showCart() {
    // we want the alerts displayed to the user to reflect the status of the cart at
    // the time of clicking the button, so we get an array of the keys instead of operating
    // on the cart object properties directly
    var cartProducts = Object.keys(cart);
    
    // we don't want to allow the user to show multiple cart alerts at the same time, so
    // whenever the user clicks the button we cancel the current sequence of alerts
    clearTimeout(window.showCartTimeoutId);
    
    // recursively display all products in cart
    function showPartForProduct(i) {
        if (i < cartProducts.length) {
            cartStr = "Product: " + cartProducts[i] + "\nQuantity: " + cart[cartProducts[i]];
            alert("Cart contents:\n\n" + cartStr);
            window.showCartTimeoutId = window.setTimeout(showPartForProduct.bind(this, i+1), 5000);
        }
    }
    
    showPartForProduct(0); // start showing products
}

// Adds a product to the global cart and adjusts its quantity in the global products
function addToCart(productName) {
    inactiveTime = 0; // reset the timer
  
    if (products[productName] > 0) {
        if (cart[productName]) {
            cart[productName] += 1;
        } else {
            cart[productName] = 1;
        }
        
        products[productName] -= 1;
    } else {
        alert("Couldn't add " + productName + " to cart (item is out of stock)");
    }
}

// Removes a product from the global cart and adjusts its quanity in the global products
function removeFromCart(productName) {
    inactiveTime = 0; // reset the timer
    
    if (cart[productName] && cart[productName] > 0) {
        cart[productName] -= 1;
        products[productName] += 1;
        
        if (cart[productName] == 0) {
            delete cart[productName];
        }        
    } else {
        alert("Couldn't remove " + productName + " from cart (does not exist in cart)");
    }
}

// Checks the current inactive time and display a message to the user if they exceed the timeout
function checkTimer() {
    var timeout = 30;
    
    if (inactiveTime > timeout) {
        alert("Hey there! Are you still planning to buy something?");
        inactiveTime = 0;
    }
    
    // increment the inactive time by 1 every second
    inactiveTime += 1;
}

// Initialize cart and product features
(function setup() {
    var productElements = document.querySelectorAll(".product");
    var maxQuantity = 5;

    for (var i = 0; i < productElements.length; i++) {
        /* Add the click handlers for all product cart buttons */
        var productName = productElements[i].querySelector(".productName").textContent;
        productElements[i].querySelector(".cartButton.add").addEventListener("click", addToCart.bind(this, productName));
        productElements[i].querySelector(".cartButton.remove").addEventListener("click", removeFromCart.bind(this, productName));
        
        /* Initialize the quanity of each product */
        products[productName] = maxQuantity;
    }
    
    window.setInterval(checkTimer, 1000);
})();