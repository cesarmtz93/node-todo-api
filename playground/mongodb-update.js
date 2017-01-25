// const MongoClient = require("mongodb").MongoClient;

// object distrocturing, pull properties from an object creating varibles
// ex var user = {name: 'cesar', age:23}
// var{name} = user;
const {MongoClient, ObjectId} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if(error) return console.log("Unable to connect to MongoDb Server", error);

    console.log("Connected to MongoDB Server");

    // db.collection("Todos").findOneAndUpdate({_id : ObjectId("587f735e160f3222975e2308")}, {$set: { completed: true }}, {returnOriginal: false}).then((result) => {
    //     console.log(JSON.stringify(result, undefined, 4));
    // });

    db.collection("Users").findOneAndUpdate({_id : ObjectId("587f76161c53c52314a1a29d")}, {
        $set: {name: "Cesar"}, 
        $inc: {age: 1}
    }, {returnOriginal: false}).then((result) => {
        console.log(JSON.stringify(result, undefined, 4));
    });

    db.close();
});
