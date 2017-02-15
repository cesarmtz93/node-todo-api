// set up ======================================================================
const {ObjectID} = require("mongodb");
var express = require('express');
var router = express.Router();
const _ = require("lodash");

const {mongoose} = require("./../db/mongoose");
const {Todo} = require("./../models/todo");
const {authenticate} = require("./../middleware/authenticate");

// Middleware specific to this router
router.use((req, res, next) => {
  next();
});

// todos routes ================================================================
router.post("/todos", authenticate, (request, response) => {
    var todo = new Todo({
        text: request.body.text, 
        _creator: request.user._id
    });
    
    todo.save().then((todos) => {
        response.status(200).send(todos);
    }, (error) => {
        response.status(400).send(error);
    });
});

router.get("/todos", authenticate, (request, response) => {
    Todo.find({_creator: request.user._id}).then((todos) => {
        response.status(200).send({todos});
    }, (error) => {
        response.status(400).send(error);
    });
});

router.get("/todos/:id", authenticate, (request, response) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)) return response.status(404).send();

    Todo.findOne({_creator: request.user._id, _id: id}).then((todo) => {
        if(!todo) return response.status(404).send();
        response.status(200).send({todo});
    }, (error) => {
        response.status(400).send(error);
    });
});

router.delete("/todos/:id", authenticate, (request, response) => {
    var id = request.params.id;
    
    if(!ObjectID.isValid(id)) return response.status(404).send();

    Todo.findOneAndRemove({_creator: request.user._id, _id: id}).then((todo) => {
        if(!todo) return response.status(404).send();
        response.status(200).send({todo});
    }, (error) => {
        response.status(400).send();
    });
});

router.patch("/todos/:id", authenticate, (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ["text", "completed"]);

    if(!ObjectID.isValid(id)) return response.status(404).send();

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_creator: request.user._id, _id: id}, {$set: body}, {new: true}).then((todo) => {
        if(!todo) return response.status(404).send();
        response.status(200).send({todo});
    }, (error) => {
        response.status(400).send();
    });
});

module.exports = router;
