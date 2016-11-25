conn = new Mongo();
db = conn.getDB("cpen400a_group12");

collections = ["products", "orders", "users"];

// remove then create all our collections
collections.forEach(
    function(collection_name) {
        db[collection_name].remove({});
        db.createCollection(collection_name);
    }
);

var products = {
    "KeyboardCombo":{
       "price":30,
       "quantity":1,
       "url":"/images/products/KeyboardCombo.png",
       "categories": ["tech", "gifts"]
    },
    "Mice":{
       "price":7,
       "quantity":4,
       "url":"/images/products/Mice.png",
       "categories": ["tech", "gifts"]
    },
    "PC1":{
       "price":329,
       "quantity":10,
       "url":"/images/products/PC1.png",
       "categories": ["tech"]
    },
    "PC2":{
       "price":375,
       "quantity":8,
       "url":"/images/products/PC2.png",
       "categories": ["tech"]
    },
    "PC3":{
       "price":345,
       "quantity":10,
       "url":"/images/products/PC3.png",
       "categories": ["tech"]
    },
    "Tent":{
       "price":30,
       "quantity":10,
       "url":"/images/products/Tent.png",
       "categories": ["supplies"]
    },
    "Box1":{
       "price":6,
       "quantity":5,
       "url":"/images/products/Box1.png",
       "categories": ["supplies", "stationary"]
    },
    "Box2":{
       "price":7,
       "quantity":3,
       "url":"/images/products/Box2.png",
       "categories": ["supplies", "stationary"]
    },
    "Clothes1":{
       "price":20,
       "quantity":10,
       "url":"/images/products/Clothes1.png",
       "categories": ["clothing"]
    },
    "Clothes2":{
       "price":25,
       "quantity":5,
       "url":"/images/products/Clothes2.png",
       "categories": ["clothing"]
    },
    "Jeans":{
       "price":36,
       "quantity":6,
       "url":"/images/products/Jeans.png",
       "categories": ["clothing"]
    },
    "Keyboard":{
       "price":18,
       "quantity":4,
       "url":"/images/products/Keyboard.png",
       "categories": ["tech", "gifts"]
    }
};

// populate the products collection
for (p in products) {
    var entry = products[p];
    products[p].name = p;
    db.products.insert(entry);
}

// populate the users collection
db.users.insert([
    {token: "a8l6Nos5N9"},
    {token: "PkpIEQlH44"},
    {token: "00WBE00XXf"},
    {token: "v3gEKNMZys"}
]);