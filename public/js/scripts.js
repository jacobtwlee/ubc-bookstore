/*
    scripts.js
    This file contains all logic required to initialize and manipulate the
    document.
*/


/* Global variables */
var cart = {}
var products = {}
var inactiveTime = 0;
var productsUrl = "/products";

// Make an AJAX request to the server to get the product data
// Returns a promise which the caller can use to get the product data when ready
function loadProductData (url, category) {
    return new Promise (function (resolve, reject) {
        if (category) {
            category = "&category=" + category;
        } else {
            category = "";
        }
        
        var authUrl = url + "?token=" + sessionStorage.getItem("authToken") + category;
        var xhr = new XMLHttpRequest();
        var maxAttempts = 5;
        var attempts = 0;
        
        var tryRequest = function () {
            if (attempts < maxAttempts) {
                attempts += 1;
                xhr.timeout = 5000;
                xhr.open("GET", authUrl);
                xhr.send();
            } else {
                reject("Failed to retrieve products after " + attempts + " attempts.");
            }
        };
        
        xhr.onload = function () {
            if (xhr.status == 200) {
                try {
                    var responseData = JSON.parse(xhr.responseText);
                    resolve(responseData.content);
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
    var $this = $(this);
    
    // disable the checkout button until the request completes to prevent
    // placing the order multiple times
    $this.addClass("disabled");
    
    var url = "/checkout";
    var xhr = new XMLHttpRequest();
    
    xhr.timeout = 5000;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    function successHandler() {
        $this.removeClass("disabled");
        alert("Checkout complete!");
        
        // after checkout we remove all items from the user's cart
        for (item in cart) {
            delete cart[item];            
            updateProduct(item);
            updateCartModal(item);
        }
        
        updateCartPrice();
        hideModal();
    }
    
    function errorHandler() {
        $this.removeClass("disabled");
        alert("There was an error during checkout. Please try again.");
    }
    
    xhr.onload = function () {
        if (xhr.status == 200) {
            successHandler();
        } else {
            errorHandler();
        }
    };

    xhr.onerror = errorHandler;
    xhr.ontimeout = errorHandler;
    
    var payload = {
        cart: cart,
        total: getCartPrice(),
        token: sessionStorage.getItem("authToken")
    }
    
    xhr.send(JSON.stringify(payload));
}

// Load all products of a given category from the server
// If category is not set then all products will be loaded
function loadProducts(category) {
    // Clear all existing products before showing new ones
    var $products = $("#productList");
    $("#productList").empty();
    
    // Make the request to the server to get the product data
    loadProductData(productsUrl, category).then(function (productData) {
        if ($.isEmptyObject(productData)) {
            var noProductsTemplate = templates.noProducts();
            $products.append(noProductsTemplate);
        }
        
        for (var product in productData) {
            // Only update global products if user hasn't added the item to the cart
            if (!(product in cart)) {
                products[product] = {
                    "quantity": productData[product].quantity,
                    "price": productData[product].price
                }    
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
}

// Prompt the user to authenticate
function initAuth(callback) {
    if (sessionStorage.getItem("authToken")) {
        callback();
        return;
    }
    
    var username = prompt("Enter your username:");
    
    var url = "/authenticate";
    var xhr = new XMLHttpRequest();
    
    xhr.timeout = 5000;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    var errorHandler = function () {
        alert("Authentication unsuccessful.");
        initAuth(callback);
    };
    
    xhr.onload = function () {
        if (xhr.status == 200) {
            try {
                var response = JSON.parse(xhr.responseText);
                sessionStorage.setItem("authToken", response.content.token);
                callback();
            } catch (e) {
               errorHandler();
            }
        } else {
            errorHandler();
        }
    }
    
    xhr.onerror = errorHandler;
    xhr.onabort = errorHandler;
    xhr.ontimeout = errorHandler;
    
    xhr.send(JSON.stringify({"username": username}));
}

// Initialize cart and product features
(function setup() {     
    initAuth(function () {
        loadProducts();
        
        // Add the click handlers for the product category buttons
        $(".categoryButton").on("click", function () {
            loadProducts($(this).attr("data-category"));
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
    }); 
})();