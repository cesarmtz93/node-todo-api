// const MongoClient = require("mongodb").MongoClient;

// object distrocturing, pull properties from an object creating varibles
// ex var user = {name: 'cesar', age:23}
// var{name} = user;
const {MongoClient, ObjectId} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if(error) return console.log("Unable to connect to MongoDb Server", error);

    console.log("Connected to MongoDB Server");

    //deleteMany
    // db.collection("Todos").deleteMany({text: "Purchase"}).then((result) => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection("Todos").deleteOne({text: "Purchase"}).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    // db.collection("Todos").findOneAndDelete({text: "Purchase"}).then((result) => {
    //     console.log(result);
    // });

    // db.collection("Users").deleteMany({name: "Cesar Martinez"});

    db.collection("Todos").findOneAndDelete({_id : ObjectId("587f87e03467364ab2114bb8")}).then((result) => {
        console.log(JSON.stringify(result, undefined, 4));
    });

    db.close();
});
