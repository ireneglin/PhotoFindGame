var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var GamePlayer = require('../models/gamePlayer');
var Game = require('../models/game');
var PlayerBadge = require('../models/playerBadges');
var Badge = require('../models/badges');
var PointHistory = require('../models/pointHistory');
var User  = require('../models/user');

var router = express.Router();


/*POST
Endpoint: /grantBadge/:id
Description: Assign a badge to a user
Input: userID, badgeID
Output: playerBadgeID 
*/

router.post('/grantBadge/:id', function(req, res) {
	
	PlayerBadge.collection.insertOne({
		userID        : req.params.id,
        badgeID     : req.body.badgeID,
        }, function(err, result) {
				PlayerBadge.collection.updateOne({"_id":result.insertedId},{ $set: {playerBadgeID : result.insertedId.toString()}});
				res.json({
					playerBadgeID: result.insertedId
				});
		});
});


router.post('/grantPoints', function(req, res) {
	
				User.collection.findOneAndUpdate(
					   { _id : req.body.userID },
					   { $inc: { "local.totalPoints" : parseInt(req.body.points,10) } }
				);	

				PointHistory.collection.insertOne({
      				   	userID : req.body.userID,
						gameID : req.body.gameID, 
     				   	date : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        				points : parseInt(req.body.points,10),
        				activityType : req.body.reason
				});
				res.status(200).send();
				
})


module.exports = router;