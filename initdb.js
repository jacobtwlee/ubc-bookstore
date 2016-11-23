conn = new Mongo();
db = conn.getDB("cpen400a_group12");

collections = ["products", "orders", "users"];

// remove then create all our collections
collections.forEach(
    function(collection_name) {
        print(collection_name);
        db[collection_name].remove({});
        db.createCollection(collection_name);
    }
);

// populate the products collection
db.products.insert({
   "KeyboardCombo":{
      "price":30,
      "quantity":1,
      "url":"/images/products/KeyboardCombo.png"
   },
   "Mice":{
      "price":7,
      "quantity":4,
      "url":"/images/products/Mice.png"
   },
   "PC1":{
      "price":329,
      "quantity":10,
      "url":"/images/products/PC1.png"
   },
   "PC2":{
      "price":375,
      "quantity":8,
      "url":"/images/products/PC2.png"
   },
   "PC3":{
      "price":345,
      "quantity":10,
      "url":"/images/products/PC3.png"
   },
   "Tent":{
      "price":30,
      "quantity":10,
      "url":"/images/products/Tent.png"
   },
   "Box1":{
      "price":6,
      "quantity":5,
      "url":"/images/products/Box1.png"
   },
   "Box2":{
      "price":7,
      "quantity":3,
      "url":"/images/products/Box2.png"
   },
   "Clothes1":{
      "price":20,
      "quantity":10,
      "url":"/images/products/Clothes1.png"
   },
   "Clothes2":{
      "price":25,
      "quantity":5,
      "url":"/images/products/Clothes2.png"
   },
   "Jeans":{
      "price":36,
      "quantity":6,
      "url":"/images/products/Jeans.png"
   },
   "Keyboard":{
      "price":18,
      "quantity":4,
      "url":"/images/products/Keyboard.png"
   }
});