var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var User  = require('../models/user');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        firstName    : String,
        lastName     : String,
        username     : String,
     //  location     : String,   -- replaced with city and country
        country      : String,
        city         : String,
        confirmToken : String,
        active       : Boolean,
        enabled      : Boolean,
        totalPoints  : Number,
        userID       : String,
        isAdmin      : Boolean,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
