
/* Global variables */
var cart = {}
var products = {}
var inactiveTime = 0;

function addToCart(productName) {
    inactiveTime = 0; // reset the timer
  
    if (products[productName] > 0) {
        if (cart[productName]) {
            cart[productName] += 1;
        } else {
            cart[productName] = 1;
        }
        
        products[productName] -= 1;
        // alert("Added " + productName + " to cart.");
    } else {
        alert("Couldn't add " + productName + " to cart (item is out of stock)");
    }
}

function removeFromCart(productName) {
    inactiveTime = 0; // reset the timer
    
    if (cart[productName] && cart[productName] > 0) {
        cart[productName] -= 1;
        products[productName] += 1;
        
        if (cart[productName] == 0) {
            delete cart[productName];
        }
        
        // alert("Removed " + productName + " from cart.");
    } else {
        alert("Couldn't remove " + productName + " from cart (does not exist in cart)");
    }
}

function checkTimer() {
    var timeout = 30;
    
    if (inactiveTime > timeout) {
        alert("Hey there! Are you still planning to buy something?");
        inactiveTime = 0;
    }
    
    inactiveTime += 1;
}

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