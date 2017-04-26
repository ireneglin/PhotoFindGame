var mongoose = require('mongoose');

// define the schema for our game model
// gameName, gameDifficulty, gameInfo, gameCity, gameCountry
var gameSchema = mongoose.Schema({

        gameID              : String,
        gameName            : String,
        gameDifficulty      : String,
        gameInfo            : String,
        gameCity            : String,
        gameCountry         : String,
        gamePhoto           : String, //This is a base 64 string containing the image
        userID              : String,
        active              : Boolean

});

module.exports = mongoose.model('Game', gameSchema);
