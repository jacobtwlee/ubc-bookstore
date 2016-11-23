/*
    scripts.js
    This file contains all logic required to initialize and manipulate the
    document.
*/


/* Global variables */
var cart = {}
var products = {}
var inactiveTime = 0;
var apiUrl = "/products";

// Make an AJAX request to the server to get the product data
// Returns a promise which the caller can use to get the product data when ready
function loadProductData (url) {
    return new Promise (function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var maxAttempts = 5;
        var attempts = 0;
        
        var tryRequest = function () {
            if (attempts < maxAttempts) {
                attempts += 1;
                xhr.timeout = 5000;
                xhr.open("GET", url);
                xhr.send();
            } else {
                reject("Failed to retrieve products after " + attempts + " attempts.");
            }
        };
        
        xhr.onload = function () {
            if (xhr.status == 200) {
                try {
                    var productData = JSON.parse(xhr.responseText);
                    resolve(productData);
                } catch (e) {
                   console.log("Error parsing JSON response");
                   tryRequest();
                }
            } else {
                tryRequest();
            }
        };

        xhr.onerror = tryRequest;
        xhr.ontimeout = tryRequest;
        
        // Start the first request
        tryRequest();
    });
}

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

// Update the product DOM element in the products list
function updateProduct(productName) {
    var $el = $('.product[data-product="' + productName + '"]');
    
    $el.find(".productPrice").text("$" + products[productName].price);
    
    if (cart[productName] && cart[productName] > 0) {
        $el.find(".cartButton.remove").show();
    } else {
        $el.find(".cartButton.remove").hide();
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

// Update the total dollar amount of products in the cart
function updateCartPrice() {
    // update all price DOM elements
    $(".cartPrice").text(getCartPrice());
}

// Get the current cart price
function getCartPrice() {
    var cost = 0;
    
    // calculate cost of iterms in cart
    for (var product in cart) {
        cost += cart[product] * products[product].price;
    }
    
    return cost;
}

// Show the modal with the cart contents
function showModal() {
    setInactiveTime(0); // Reset the timer
    $("#modalContainer").show();
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
        if (cart[productName] && cart[productName] > 0) {
            // Update the quantity
            $tableEntry.find(".cartQuantity").text(cart[productName]);
            
            // Update the price
            $tableEntry.find(".productTotal").text(productPrice);
        } else {
            // Item doesn't/shouldn't exist in cart, so remove the cart element
            delete cart[productName];
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
    
    if ($.isEmptyObject(cart)) {
        $(".checkoutButton").addClass("disabled");
    } else {
        $(".checkoutButton").removeClass("disabled");
    }
}

// Handle checkout logic
function checkout() {
    $this = $(this);
    $this.addClass("disabled");
    
    loadProductData(apiUrl).then(function (productData) {
        var priceChanges = [];
        var quantityChanges = [];
        
        var confirmMessage = "";
        var priceChangeMessage = "The price of the following items has changed:\n";
        var quantityChangeMessage = "Some items in your cart are no longer available in the quantity selected. The following items have been updated in your cart:\n";
        
        for (var product in productData) {            
            // the price changed
            if (productData[product].price != products[product].price) {
                if (product in cart) {
                    priceChanges.push(product);
                    priceChangeMessage += "- " + product + ": $" + productData[product].price + "\n"
                }
                products[product].price = productData[product].price;
            }
            
            // the quanity changed
            if (productData[product].quantity < cart[product]) {
                if (product in cart) {
                    quantityChanges.push(product);
                    quantityChangeMessage += "- " + product + ": " + productData[product].quantity + "\n";
                    cart[product] = productData[product].quantity;
                }
                
                products[product].quantity = productData[product].quantity;
            }
            
            updateProduct(product);
            updateCartModal(product);
        }
        
        updateCartPrice();
                    
        if (priceChanges.length > 0) {
            confirmMessage += priceChangeMessage + "\n";
        }
        
        if (quantityChanges.length > 0) {
            confirmMessage += quantityChangeMessage + "\n";
        }
        
        var cartPrice = getCartPrice();
        
        if (cartPrice > 0) {
            var totalPriceMessage = "The cart total is $" + cartPrice + ". Do you want to continue checkout?";
            confirmMessage += totalPriceMessage;
        }
        
        confirm(confirmMessage);
        
        if (!$.isEmptyObject(cart)) {
            $this.removeClass("disabled");
        }
    }, function (error) {
        alert(error);
        $this.removeClass("disabled");
    });
}

// Initialize cart and product features
(function setup() {    
    var $products = $("#productList");
    
    // Make the request to the server to get the product data
    loadProductData(apiUrl).then(function (productData) {
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
    }, function (error) {
        alert(error);
    });
    
    // Add the click handlers for the modal show/hide buttons
    $("#showCartButton").on("click", showModal);
    $("#modalContainer .modalCloseButton").on("click", hideModal);
    
    // Add checkout button handler
    $(".checkoutButton").on("click", checkout);
    
    // Add keydown handler for closing the modal with the ESC key
    $(document).on("keydown", function (e) {
        if (e.keyCode == 27) hideModal();
    });
    
    // Check/update the timer every second
    setInterval(checkInactiveTime, 1000);
})();