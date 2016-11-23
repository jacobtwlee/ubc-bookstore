var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//mongodb

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test';

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
// Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to mongodb");
    //get collection
    //get contents of collection
    //send to objects from collection to client via web socket
    /*var findDocuments = function(db, callback) {
      // Get the documents collection
        var collection = db.collection('documents');
        // Find some documents
        collection.find({'a': 3}).toArray(function(err, docs) {
          assert.equal(err, null);
          console.log("Found the following records");
          console.log(docs);
          callback(docs);
        });      
    }*/


    db.close();
  });


})


