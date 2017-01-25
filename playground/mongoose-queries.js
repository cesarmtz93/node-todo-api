const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// 5887c85a6ebc4c0ca5316f4f
var todoId = "5887c85a6ebc4c0ca5316f4f";
var userId = "58877f6079542a024eb13167";

if(!ObjectID.isValid(todoId) || !ObjectID.isValid(userId)) {
    return console.log("ID not valid")
}

Todo.find({_id: todoId}).then((todos) => {
    return console.log("Todos",JSON.stringify(todos, undefined, 4));
});

Todo.findOne({_id: todoId}).then((todo) => {
    if(!todo) return console.log("unable to find todo not found");
    return console.log("Todo", JSON.stringify(todo, undefined, 4));
});

Todo.findById(todoId).then((todo) => {
    if(!todo) return console.log("unable to find todo not found");
    return console.log("Todo by Id", JSON.stringify(todo, undefined, 4));
}).catch((error) => console.log(error.message));


User.findById(userId).then((user) => {
    if(!user) return console.log("unable to find user");
    return console.log("User by Id", JSON.stringify(user, undefined, 4));
}).catch((error) => console.log(error.message));

