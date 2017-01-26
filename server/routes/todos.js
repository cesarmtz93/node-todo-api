// set up ======================================================================
var express = require('express');
var router = express.Router();

const _ = require("lodash");

const {ObjectID} = require("mongodb");
const {mongoose} = require("./../db/mongoose");
const {Todo} = require("./../models/todo");

// middleware specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// todos routes ================================================================
router.post("/todos", (request, response) => {
    var todo = new Todo({text: request.body.text});
    todo.save().then((todos) => {
        response.status(200).send(todos);
    }, (error) => {
        response.status(400).send(error);
    });
});

router.get("/todos", (request, response) => {
    Todo.find().then((todos) => {
        response.status(200).send({todos});
    }, (error) => {
        response.status(400).send(error);
    });
});

router.get("/todos/:id", (request, response) => {
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

router.delete("/todos/:id", (request, response) => {
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

router.patch("/todos/:id", (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ["text", "completed"]);

    if(!ObjectID.isValid(id)) {
        response.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) return response.status(404).send();
        response.status(200).send({todo});
    }, (error) => {
        response.status(400).send();
    });
});

module.exports = router;
