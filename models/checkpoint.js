var mongoose = require('mongoose');

//checkpoints (checkpointImg, checkpointHint,  checkpointID, GameID)

var checkpointSchema = mongoose.Schema({

        checkpointID        : String,
        gameID              : String,
        checkpointImg       : String,  //Base64 image string
        checkpointHint      : String

});


module.exports = mongoose.model('Checkpoint', checkpointSchema);