// set up ======================================================================
require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");

// configuration ===============================================================
var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// listen (start app with node server.js) ======================================
app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`);
});

// routes =======================================================================
var todos = require("./routes/todos");
app.use(todos);

var users = require("./routes/users");
app.use(users);

module.exports = {app};
