/*
    scripts.js
    This file contains all logic required to initialize and manipulate the
    document.
*/


/* Global variables */
var cart = {}
var products = {}
var inactiveTime = 0;

// Adds a product to the global cart and adjusts its quantity in the global products
function addToCart(productName) {
    setInactiveTime(0); // Reset the timer
  
    if (products[productName].quantity > 0) {
        if (cart[productName]) {
            cart[productName] += 1;
        } else {
            cart[productName] = 1;
        }
        
        $('.product[data-product="' + productName + '"]').find(".cartButton.remove").show();
        products[productName].quantity -= 1;
        updateCartModal(productName);
        updateCartPrice();
    } else {
        alert("Couldn't add " + productName + " to cart (item is out of stock)");
    }
}

// Removes a product from the global cart and adjusts its quanity in the global products
function removeFromCart(productName) {
    setInactiveTime(0); // Reset the timer
    
    if (cart[productName] && cart[productName] > 0) {
        cart[productName] -= 1;
        products[productName].quantity += 1;
        
        if (cart[productName] == 0) {
            $('.product[data-product="' + productName + '"]').find(".cartButton.remove").hide();
            delete cart[productName];
        }
        
        updateCartModal(productName);
        updateCartPrice();
    } else {
        alert("Couldn't remove " + productName + " from cart (does not exist in cart)");
    }
}

// Checks the current inactive time and display a message to the user if they exceed the timeout
function checkInactiveTime() {
    var timeout = 300;
    
    if (inactiveTime >= timeout) {
        alert("Hey there! Are you still planning to buy something?");
        setInactiveTime(0);
    }
    
    // increment the inactive time by 1 every second
    setInactiveTime(inactiveTime + 1);
}

// A helper to update the global timer variable and the DOM
function setInactiveTime(time) {
    // Update the global timer
    inactiveTime = time;
    
    // Update the DOM
    $("#inactiveTime").text(time);
}

// Calculate and set the total dollar amount of products in the cart
function updateCartPrice() {
    var cost = 0;
    
    // calculate cost of iterms in cart
    for (var product in cart) {
        cost += cart[product] * products[product].price;
    }
    
    // update all price DOM elements
    $(".cartPrice").text(cost);
}

// Show the modal with the cart contents
function showModal() {
    $("#modalContainer").show()
}

// Hide the modal with the cart contents
function hideModal() {
    $("#modalContainer").hide();
}

// Update the cart modal for the specified product
function updateCartModal(productName) {    
    var $cartTable = $("#modalContainer .cartTable");
    var $tableEntry = $cartTable.find('tr[data-product="' + productName + '"]');
    var productPrice = cart[productName] * products[productName].price;
    
    if ($tableEntry.length > 0) {
        if (cart[productName]) {
            // Update the quantity
            $tableEntry.find(".cartQuantity").text(cart[productName]);
            
            // Update the price
            $tableEntry.find(".productTotal").text(productPrice);
        } else {
            // Item doesn't exist in cart, so remove the cart element
            $tableEntry.remove();
        }
    } else {
        // Make sure product is in cart
        if (!(productName in cart)) return;
        
        // Render the cart entry and add it to the DOM
        var cartEntryTemplate = templates.cartEntry({
            productName: productName,
            productQuantity: cart[productName],
            productPrice: productPrice
        });
        
        $tableEntry = $(cartEntryTemplate).appendTo($cartTable);
        
        // Add the click handlers for the add/remove buttons
        $tableEntry.find(".modalCartButton.add").on("click", addToCart.bind(null, productName));
        $tableEntry.find(".modalCartButton.remove").on("click", removeFromCart.bind(null, productName));
    }
}

// Initialize cart and product features
(function setup() {    
    var $products = $("#productList");
    
    for (var product in productData) {
        // Initialize the product in our products global variable
        products[product] = {
            "quantity": productData[product].quantity,
            "price": productData[product].price
        }
        
        // Render the product HTML and add it to the DOM
        var productTemplate = templates.product({
            productName: product,
            productPrice: productData[product].price,
            productImage: productData[product].url
        });
        
        var $product = $(productTemplate).appendTo($products);
        
        // Add the click handlers for the add/remove buttons
        $product.find(".cartButton.add").on("click", addToCart.bind(null, product));
        $product.find(".cartButton.remove").on("click", removeFromCart.bind(null, product));
        
        // We initially hide the remove button until the user adds that item to the cart
        $product.find(".cartButton.remove").hide();
    }
    
    // Add the click handlers for the modal show/hide buttons
    $("#showCartButton").on("click", showModal);
    $("#modalContainer .modalCloseButton").on("click", hideModal);
    
    // Bonus task: add keydown handler for closing the modal with the ESC key
    $(document).on("keydown", function (e) {
        if (e.keyCode == 27) hideModal();
    });
    
    // Check/update the timer every second
    setInterval(checkInactiveTime, 1000);
})();