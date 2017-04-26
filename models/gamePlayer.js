var mongoose = require('mongoose');

// game players

var gamePlayerSchema = mongoose.Schema({

        gamePlayerID    : String,
        gameID          : String,
        userID          : String

});


module.exports = mongoose.model('GamePlayer', gamePlayerSchema);
