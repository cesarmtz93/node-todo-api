// const MongoClient = require("mongodb").MongoClient;

// object distrocturing, pull properties from an object creating varibles
// ex var user = {name: 'cesar', age:23}
// var{name} = user;
const {MongoClient, ObjectId} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if(error) return console.log("Unable to connect to MongoDb Server", error);

    console.log("Connected to MongoDB Server");

    db.collection("Users").find({name: "%Cesar%"}).toArray().then((documents) => {
        console.log(JSON.stringify(documents, undefined, 4));
    }, (error) => {
        console.log("unable to fetch todos");
    });

    db.collection("Todos").find({
        _id : ObjectId("587f735e160f3222975e2308")
    }).toArray().then((documents) => {
        console.log(JSON.stringify(documents, undefined, 4));
    }, (error) => {
        console.log("unable to fetch todos");
    });

    db.collection("Todos").find().count().then((count) => {
        console.log("Todos count: "+count);
    }, (error) => {
        console.log("unable to fetch todos");
    });

    db.close();
});
