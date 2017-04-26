var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var Badge = require('../models/badges');
var router = express.Router();


/*POST
Endpoint: /create
Description: Create a new badge
Input: description, badgePhoto
Output: HTTP OK - Badge ID 
*/

router.post('/create', function(req, res) {
	
	Badge.collection.insertOne({
			description: req.body.description,
			badgePhoto: req.body.badgePhoto,
		}, function(err, result) {
			Badge.collection.updateOne({"_id":result.insertedId},{ $set: {badgeID : result.insertedId.toString()}});
				
			res.json({BadgeID: result.insertedId}).status(200).send();
		});
});



module.exports = router;