var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var User  = require('../models/user');
var Submission = require('../models/checkpointSubmission');
var Checkpoint = require('../models/checkpoint'); 
var History = require('../models/pointHistory');


router.get('/:id',function (req,res) {
    Checkpoint.find({_id:req.params.id},function (err, checkpoint) {
    	console.log(err);
        if(err) res.status(500).send();
        else{
        	console.log(checkpoint);
        	res.json(checkpoint).status(200);        	
        }
    });
});

/*POST	
Engpoint:		/checkpoint/:checkpointID/Submissions	
Description: 	User posts a photo	submission
Input: 			Photo
Output: 		submissionID
*/
// Add photo submission to checkpoint
router.post('/:checkpointID/submissions', function (req, res) {
    //Insert into collection
	var hs = Checkpoint.collection.find({
		$and: [{checkpointID: req.params.checkpointID}, {userID: req.body.userID}]
	});

	Submission.collection.insertOne({
		checkpointID : req.params.checkpointID,
		submissionPhoto : req.body.submissionPhoto,
		userID : req.user._id,
		username : req.user.username,
		photoStatus : 1, //1 to mean pending 
		submissionDate : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
	}, function(err, result) {
		Submission.collection.updateOne({"_id":result.insertedId},{ $set: {submissionID : result.insertedId.toString()}});
		res.json({
			submissionID : result.insertedId
		});
	});
});


/*GET	
Endpoint: 		/checkpoint/:checkpointID/submissions
Description:	Get photos submitted to each checkpoint	
input: 			Nothing	
Output: 		array of checkpointSubmissions (submissionID, submissionPhoto, photoStatus, userID, username, submissionDate)	
*/
// Get photos submitted to each checkpoint
var allSubmissions = [];
router.get('/:checkpointID/submissions', function (req, res, next) {
	Submission.collection.find({
		checkpointID: req.params.checkpointID
	}).toArray(function(err, docs) {
      var allSubmissions = [];
      for (var i = 0; i < docs.length; i++) {
        allSubmissions.push(docs[i]);
      }
      res.send(allSubmissions);
      });
});

var mySubmissions = [];
router.get('/:checkpointID/mysubmissions', function (req, res, next) {
	Submission.collection.find({
		checkpointID: req.params.checkpointID,
		userID: req.user._id
	}).toArray(function(err, docs) {
      var mySubmissions = [];
      for (var i = 0; i < docs.length; i++) {
        mySubmissions.push(docs[i]);
      }
      res.send(mySubmissions);
      });
});

router.get('/:checkpointID/unhandledsubmissions', function (req, res, next) {
	Submission.collection.find({
		checkpointID: req.params.checkpointID,
		photoStatus: 1
	}).toArray(function(err, docs) {
      var unhandledSubmissions = [];
      for (var i = 0; i < docs.length; i++) {
        unhandledSubmissions.push(docs[i]);
      }
      res.send(unhandledSubmissions).status(200);
      });
});


/*POST	
Endpoint:		/submissions/approve
Description: 	Game manager is approving a photo
Input: 			photoStatus	
Output: 		HTTP OK	
*/
// Game manager approve a photo and player gets points
router.post('/submissions/approve', function (req, res) {
   var trackPoints =50;
	//track if game is finished (all checkpoints cleared) and assign points
  //update total points
		User.collection.updateOne(
             { "_id" : ObjectId(req.body.userID) },
		   { $inc: { "local.totalPoints" : 50 } }
		);

	Submission.collection.updateOne({checkpointID: req.body.checkpointID, userID: ObjectId(req.body.userID)},
	  	{$set: {photoStatus: 2}}
	  	, function(err, result) {
	  	if (result.modifiedCount !== 1) {
	    	res.status(403).send();
	  	} else {
	    	//add new entry to history log (activity, gameID, points)
			History.collection.insert({
		        userID : req.body.userID,
		        //gameID : req.body.gameID, 
						date : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
		        points : trackPoints,
		        activityType : "Checkpoint Cleared"
			}, function(err, result) {
					res.json({
						pointHistoryID : result.insertedId
					});
			});
	  	}
	});

	//res.send("hello");
});


/*POST	
Endpoint:		/submissions/reject
Description: 	Game manager is rejecting a photo
Input: 			photoStatus	
Output: 		HTTP OK	
*/
// Game manager reject a photo
router.post('/submissions/reject', function (req, res) {
	if (!req.body.submissionID && !req.body.checkpointID && !req.body.submissionPhoto 
		&& !req.body.photoStatus && !req.body.userID && !req.body.username)
      return res.sendStatus(400);
    // Set update JSON
    var updateJSON = {};
    if (req.body.submissionID)
      updateJSON.submissionID = req.body.submissionID;
    if (req.body.checkpointID)
      updateJSON.checkpointID = req.body.checkpointID;
    if (req.body.submissionPhoto)
      updateJSON.submissionPhoto = req.body.submissionPhoto;
	if (req.body.photoStatus)
	updateJSON.photoStatus = 0;
	if (req.body.userID)
	updateJSON.userID = req.body.userID;
	if (req.body.username)
	updateJSON.username = req.body.username;
	//if (req.body.submissionID === update)
	//res.send()
    // Update
    Submission.collection.updateOne({
      submissionID: req.body.submissionID
    }, {
      $set: {"photoStatus": updateJSON.photoStatus}
    }, function(err, result) {
      if (result.matchedCount == 1) {
        res.status(200).send();
      } else {
        res.status(403).send();
      }
    });
  });


module.exports = router;
