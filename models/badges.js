var mongoose = require('mongoose');

//Badges we can give to users

var badgeSchema = mongoose.Schema({

        badgeID             : String,
        description         : String,
        badgePhoto          : String //base64 image stored as a string

});


module.exports = mongoose.model('Badge', badgeSchema);