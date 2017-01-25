// const MongoClient = require("mongodb").MongoClient;

// object distrocturing, pull properties from an object creating varibles
// ex var user = {name: 'cesar', age:23}
// var{name} = user;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if(error) return console.log("Unable to connect to MongoDb Server", error);

    console.log("Connected to MongoDB Server");

    // db.collection("Todos").insertOne({
    //     text: "Create ScorePoint WS", 
    //     completed: false
    // }, (error, result) => {
    //     if(error) return console.log("Unable to insert todo", error);
    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    // db.collection("Users").insertOne({
    //     name: "Cesar Martinez", 
    //     age: 21,
    //     location: "Monterrey"
    // }, (error, result) => {
    //     if(error) return console.log("Unable to insert user", error);
    //     console.log(JSON.stringify(result.ops, undefined, 4));

    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    db.close();
});
