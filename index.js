var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json()) // for parsing application/json

var dburl = "mongodb://localhost:27017/cpen400a_group12";

var initApp = function (db) {
    
    // Make sure user token is valid, and if it is then execute the callback
    var validateUserAuth = function (request, response, callback) {
        var token = request.body.token || request.query.token;
        
        if (token) {
            var users = db.collection('users');
            
            users.findOne({"token": token}, function (error, result) {
                if (error || !result) {
                    response.status(401).send("Unauthorized.");
                } else {
                    callback();
                }
            });
        } else {
            response.status(401).send("Unauthorized.");
        }
    };
    
    // Start server listening
    app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'));
    });
    
    // Authenticate POST endpoint
    app.post('/authenticate', function(request, response) {
        var users = db.collection('users');
        var username = request.body.username;
        
        if (username) {
            users.findOne({"username": username}, function (error, result) {
                if (error || !result) {
                    response.status(401).send("Failed to authentiate.");
                } else {
                    response.json({token: result.token});
                }
            });
        } else {
            response.status(401).send("Failed to authentiate.");
        }
    });
    
    // Products GET endpoint
    app.get('/products', function(request, response) {
        // check if the user is valid before handling the request
        validateUserAuth(request, response, function () {
            // get the products collection
            var collection = db.collection('products');
            
            var filters = {};
            
            // check the url parameters and set the query filters
            
            if (request.query.category) {
                filters.categories = request.query.category;
            }
            
            if (!isNaN(request.query.minPrice)) {
                filters.price = filters.price || {};
                filters.price.$gte = parseFloat(request.query.minPrice);
            } else {
                if (request.query.minPrice != undefined) {
                    response.status(400).send("Invalid value for parameter minPrice.");
                    return;
                }
            }
            
            if (!isNaN(request.query.maxPrice)) {
                filters.price = filters.price || {};
                filters.price.$lte = parseFloat(request.query.maxPrice);
            } else {
                if (request.query.maxPrice != undefined) {
                    response.status(400).send("Invalid value for parameter maxPrice.");
                    return;
                }
            }
                
            // find the matching products
            collection.find(filters).toArray(function(error, result) {
                if (error) {
                    console.log("Error: could not retrieve products.")
                    response.status(500).send("An error occurred, please try again");
                } else {
                    var products = {};
                    
                    for (var i = 0; i < result.length; i++) {
                        var name = result[i].name;
                        
                        products[name] = {
                            "price": result[i].price,
                            "quantity": result[i].quantity,
                            "url": result[i].url
                        }
                    }
                    
                    response.json(products);
                }
              });
          });
    });
    
    // Checkout POST endpoint
    app.post('/checkout', function(request, response) {
        // check if the user is valid before handling the request
        validateUserAuth(request, response, function () {
            var ordersCollection = db.collection('orders');
            var productsCollection = db.collection('products');

            var cart = request.body.cart;
            var total = request.body.total;
            
            try {
                if (cart && total) {
                    var doc = {
                        cart: cart,
                        total: total
                    };
                    
                    // add the new order to the orders collection
                    ordersCollection.insert(doc, {}, function (error, result) {
                        if (error) throw new Error("Error inserting into orders collection");
                    });
                    
                    // for each product in cart update the quantity in products collection
                    for (item in cart) {
                        productsCollection.updateOne({name: item}, {$inc: {quantity: -1 * cart[item]}}, function (error, result) {
                            if (error) throw new Error("Error updating products collection");
                        });
                    }
                    
                    response.status(200).send("Checkout successful.");
                } else {
                    throw new Error("Error: a required parameter is missing");
                }
            } catch (e) {
                console.log(e);
                response.status(500).send("An error occurred, please try again");
            }
        });
    });
};

MongoClient.connect(dburl, function (error, db) {
    if (error) {
        console.log('Error: Unable to connect to Mongo server.');
        console.log(error);
        process.exit(1);
    } else {
        console.log('Successfully connected to Mongo server.');
        initApp(db);
    }
});
