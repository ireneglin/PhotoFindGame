var mongoose = require('mongoose');

//checkpointSubmissions (submissionID, submissionPhoto, photoStatus, userID, username, submissionDate)

var checkpointSubmissionSchema = mongoose.Schema({

            submissionID    : String,
            checkpointID    : String,
            submissionPhoto : String, 
            photoStatus     : Number,
            userID          : String,
            username        : String,
            submissionDate  : String

});

module.exports = mongoose.model('checkpointSubmission', checkpointSubmissionSchema);
