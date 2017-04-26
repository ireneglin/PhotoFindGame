var mongoose = require('mongoose');

//Players point history

var pointHistorySchema = mongoose.Schema({

        pointHistoryID      : String,
        userID              : String,
        gameID              : String, 
        points              : Number,
        activityType        : String,
        date                : String

});


module.exports = mongoose.model('PointHistory', pointHistorySchema);