var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var dburl = "mongodb://localhost:27017/cpen400a_group12";

var initApp = function (db) {
    
    app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'));
    });
    
    app.get('/products', function(request, response) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
        // get the products collection
        var collection = db.collection('products');
        
        // find the matching products
        collection.find({}).toArray(function(error, result) {
            
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
