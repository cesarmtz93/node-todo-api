const jwt = require("jsonwebtoken");
var data = {id: 10}

var token = jwt.sign(data, "123abc");
console.log(token);

var decoded = jwt.verify(token, "123abc");
console.log(decoded);

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
