const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// 5887c85a6ebc4c0ca5316f4f
var todoId = "5888d78f975d4fbd0edaafc5";
var userId = "58877f6079542a024eb13167";

if(!ObjectID.isValid(todoId) || !ObjectID.isValid(userId)) {
    return console.log("ID not valid")
}

// Todo.remove({}).then((result) => {
//     return console.log("result",JSON.stringify(result, undefined, 4));
// });

// Todo.findOneAndRemove({_id: todoId}).then((todo) => {
//     return console.log("Todo", JSON.stringify(todo, undefined, 4));
// });

Todo.findByIdAndRemove(todoId).then((todo) => {
    console.log("Todo", JSON.stringify(todo, undefined, 4));
}).catch((error) => console.log(error.message));


