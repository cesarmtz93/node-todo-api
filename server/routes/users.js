// set up ======================================================================
const {ObjectID} = require("mongodb");
var express = require('express');
var router = express.Router();
const _ = require("lodash");

const {mongoose} = require("./../db/mongoose");
const {User} = require("./../models/user");
const {authenticate} = require("./../middleware/authenticate");

// Middleware specific to this router
router.use((req, res, next) => {
  next();
});

// users routes ================================================================
router.post("/users", (request, response) => {
    var body = _.pick(request.body, ["email", "password"]);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        response.header("x-auth", token).send(user);
    }).catch((error) => {
        response.status(400).send(error);
    });
});

router.get("/users/me", authenticate, (request, response) => {
    response.status(200).send(request.user);
});

router.post("/users/login", (request, response) => {
    var body = _.pick(request.body, ["email", "password"]);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            response.header("x-auth", token).send(user);
        });
    }).catch((error) => {
        response.status(400).send();
    });
});

router.delete("/users/me/token", authenticate, (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    }, () => {
        response.status(400).send();
    });
});

module.exports = router;
