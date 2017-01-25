const express = require("express");
const bodyParser = require("body-parser");

const {ObjectID} = require("mongodb");
const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todo");
const {User} = require("./models/user");

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

app.post("/todos", (request, response) => {
    var todo = new Todo({text: request.body.text});
    todo.save().then((todos) => {
        response.status(200).send(todos);
    }, (error) => {
        response.status(400).send(error);
    });
});

app.get("/todos", (request, response) => {
    Todo.find().then((todos) => {
        response.status(200).send({todos});
    }, (error) => {
        response.status(400).send(error);
    });
});

app.get("/todos/:id", (request, response) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)) {
        response.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo) return response.status(404).send();
        response.status(200).send({todo});
    }, (error) => {
        response.status(400).send();
    });
});

app.delete("/todos/:id", (request, response) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)) {
        response.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) return response.status(404).send();
        response.status(200).send({todo});
    }, (error) => {
        response.status(400).send();
    });
});

module.exports = {app};
