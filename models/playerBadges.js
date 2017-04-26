var mongoose = require('mongoose');

//Players point history

var playerBadgeSchema = mongoose.Schema({

        playerBadgeID : String,
        userID        : String,
        badgeID       : String

});


module.exports = mongoose.model('PlayerBadge', playerBadgeSchema);