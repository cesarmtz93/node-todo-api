var mongoose = require("mongoose")

var User = mongoose.model('User', {
    email: {
        type: String, 
        required: true,
        minlength: 1,
        trim: true
    }
});

module.exports = {User};

// var user = new User({
//     email: "cesarmtz93@ips.com"
// });

// user.save().then((documents) => {
//     console.log(JSON.stringify(documents, undefined, 4));
// }, (error) => {
//     console.log("Unable to save", error['message']);
// });
