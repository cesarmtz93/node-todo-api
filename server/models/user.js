const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
      email: {
        type: String, 
        required: true,
        minlength: 1,
        trim: true, 
        unique: true, 
        validate: {
            validator: validator.isEmail, 
            message: "{VALUE} not a valid email"
        }
    }, 
    password: {
        type: String, 
        require: true, 
        minlength: 6
    }, 
    tokens: [{
        access :{
            type: String, 
            require: true
        }, 
        token:{
            type: String, 
            require: true
        }
    }]  
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ["_id", "email"]);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, "123abc").toString();
    user.tokens.push({access, token});
    // var decoded = jwt.verify(token, "123abc");

    return user.save().then(() => {
        return token;
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};
