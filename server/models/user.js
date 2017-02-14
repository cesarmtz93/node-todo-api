const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

UserSchema.pre("save", function(next) {
    var user = this;
    if(user.isModified("password")) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else{ 
        next();   
    }
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

    return user.save().then(() => {
        return token;
    });
}

UserSchema.methods.removeToken = function(token) {
    var user = this

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
}

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, "123abc");
    } catch(error) {
        return Promise.reject();
    }
    
    return User.findOne({
        "_id": decoded._id, 
        "tokens.token": token, 
        "tokens.access": "auth"
    });  
}

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, response) => {
                if(response) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};
