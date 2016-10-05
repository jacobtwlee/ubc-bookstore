var productElements = document.querySelectorAll(".product");

// Add the click handlers for all product cart buttons
for (var i = 0; i < productElements.length; i++) {
    var productName = productElements[i].querySelector(".productName").textContent;
    productElements[i].querySelector(".cartButton.add").addEventListener("click", addToCart.bind(this, productName));
    productElements[i].querySelector(".cartButton.remove").addEventListener("click", removeFromCart.bind(this, productName));
}

// TODO
function addToCart(productName) {
    alert("Added " + productName + " to cart.");
}

// TODO
function removeFromCart(productName) {
    alert("Removed " + productName + " from cart.");
}