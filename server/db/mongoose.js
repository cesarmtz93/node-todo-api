const mongoose = require("mongoose");

const uri = process.env.PORT ? "mongodb://root:cesarmtz@ds131109.mlab.com:31109/todo-app-api" : "mongodb://localhost:27017/TodoApp";

mongoose.Promise = global.Promise;
mongoose.connect(uri);

module.exports = {mongoose};
