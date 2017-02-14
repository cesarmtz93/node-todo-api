const bcrypt = require("bcryptjs");

var password = "123abc!"

// bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (error, hash) => {
//         console.log(hash);
//     });
// });


var hashedPassword = "$2a$120$E0O21ENaSEmWW/3JrmFkYOMP1GK4OHyiYJo0NSKO.POU1menJmKgG";

bcrypt.compare(password, hashedPassword, (error, result) => {
    console.log(result);
});


// const jwt = require("jsonwebtoken");
// var data = {id: 10}

// var token = jwt.sign(data, "123abc");
// console.log(token);

// var decoded = jwt.verify(token, "123abc");
// console.log(decoded);

// const {SHA256} = require("crypto-js");
// var message = "Iam user number 2";
// var hash = SHA256(message).toString();
// // console.log(hash);

// var data = { id: 4 }

// var token = {
//     data, 
//     hash: SHA256(JSON.stringify(data)+ "somesecret").toString()
// }

// // token.data.id = 6;
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data)+ "somesecret").toString()

// if(resultHash === token.hash) {
//     console.log("Data wasn't changed");
// } else {
//     console.log("Data was changed. Don't trust");
// }
