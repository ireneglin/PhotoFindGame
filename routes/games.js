var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var Game = require('../models/game');
var GamePlayer = require('../models/gamePlayer');
var Checkpoint = require('../models/checkpoint');
var User  = require('../models/user');
var PointHistory = require('../models/pointHistory');

var router = express.Router();

/*POST
Endpoint: /create
Description: Create a new game
Input: gameName, gameDifficulty, gameInfo, userID, gameCity, gameCountry, gamePhoto, active
Output: HTTP OK (return game ID)
*/

router.post('/create', function(req, res) {
		Game.collection.insertOne({
			gameName: req.body.gameName,
			gameDifficulty: req.body.gameDifficulty,
			gameInfo: req.body.gameInfo,
			gameCity: req.body.gameCity,
			gameCountry: req.body.gameCountry,
            gamePhoto: req.body.gamePhoto,
			userID: req.user._id.toString(),
			active: false
		}, function(err, result) {
				//update total points - they get 200 points for creating a game
				User.collection.findOneAndUpdate(
					   { "_id" : req.user._id },
					   { $inc: { "local.totalPoints" : 200 } }
				);	

				PointHistory.collection.insertOne({
      				   	userID : req.user._id.toString(),
						gameID : result.insertedId.toString(), 
     				   	date : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        				points : 200,
        				activityType : "Game Created"
				});
				Game.collection.updateOne({"_id":result.insertedId},{ $set: {gameID : result.insertedId.toString()}});
				
				if (req.body.gui != undefined)
					{
						res.redirect('/addCheckpoint?gameid='+result.insertedId);
					}
				else {
					res.json({
					gameID: result.insertedId
				});
				}
		});
});


/*GET
Endpoint: /game/:gameID
Description: Get game details
Input: Nothing
Output: gameName, gameID, gameInfo, checkpoints (array of checkpoints - checkpointImg, checkpointHint, checkpointID), gameCity, gameCountry, playerStatus
*/
router.get('/:id',function (req,res) {
    Game.find({_id:req.params.id},function (err, game) {
        if(err) res.status(500).send();
        else{
        	res.json(game).status(200);
        }
    });
});

router.get('/:id/ismanager', function (req,res){
	Game.findOne({_id : req.params.id}, function (err, game) {
        if(err) res.status(500).send();
        else if (req.user) 
		{
			if(game.userID == req.user._id) {
				res.status(200).send({admin: true});
			}
			else 
			{
				res.status(200).send({admin: false});
			}
		}
		else 
		{
			res.status(200).send({admin: false});
		}
    });
});


/*POST
Endpoint: /:gameID/edit
Description: Edit game details
Input: gameName, gameDifficulty, gameInfo, gameCity, gameCountry, gamePhoto, active, 
Output: HTTP OK (send them to their game page)
*/
router.post('/:id/edit', function(req, res) {
         Game.collection.update({"_id":ObjectId(req.params.id)},{
				gameName: req.body.gameName,
				userID: req.body.userID,
				gameDifficulty: req.body.gameDifficulty,
				gameInfo: req.body.gameInfo,
				gameCity: req.body.gameCity, 
				gameCountry: req.body.gameCountry,
				gamePhoto: req.body.gamePhoto,
				active: req.body.active
			}, function(err, result) {
				if(err) res.status(500).send();
				res.status(200).send();
			});
});



/*POST
Endpoint: /games/:gameID
Description: Register for game
Input: Nothing
Output: HTTP OK (update playerStatus)
*/
router.post('/:id',function (req,res) {
        GamePlayer.collection.insertOne({
			gameID: req.params.id,
			userID: req.user._id.toString()
    });
    res.status(200).send();
});

/*POST
Endpoint: /games/:gameID/createCheckpoint
Description: Create a new checkpoint
Input: gameID (in URL), Checkpoint Photo and Checkpoint Hint.
Output: HTTP OK
*/

router.post('/:id/createCheckpoint', function(req, res) {
	
	Checkpoint.collection.insertOne({
			gameID: req.params.id,
			checkpointImg: req.body.checkpointImg,
			checkpointHint: req.body.checkpointHint,
		}, function(err, result) {
			Checkpoint.collection.updateOne({"_id":result.insertedId},{ $set: {checkpointID : result.insertedId.toString()}});
				
				if (req.body.gui != undefined)
					{
						if (req.body.isDone == "false")
						{
							res.redirect('/addCheckpoint?gameid='+req.params.id);
						}
						else if (req.body.isDone == "true")
						{
							Game.collection.update({"_id":ObjectId(req.params.id)},{ $set: {active: true } });
							res.redirect('/game_checkpoints?gameid='+req.params.id);
						}

					}
				else {
					res.json({checkpointID: result.insertedId}).status(200);
				}
			
		});
});


/*GET
Endpoint: /games/:gameID/checkpoints
Description: Get all the checkpoints in a game
Input: gameID (in URL)
Output: CheckpointIDs of all in the game
*/
router.get('/:id/checkpoints', function (req,res){
    if(!req.params.id) res.status(404).send();
	Checkpoint.collection.find({gameID: req.params.id}).toArray(function(err,docs){
      res.json(docs).status(200);
    });
});




router.get('/',function (req,res) {
    Game.find({ active: true }, { _id: 1, gameName: 1, gameDifficulty: 1, gameCity: 1, gameCountry: 1},function (err,game) {
        if(err)res.status(500).send();
        res.json(game).status(200);
    });
});

router.post('/',function (req,res) {
    res.status(200).send();
});


router.post('/games:searchvalue',function (req,res){
	if(!req.params.searchvalue) res.status(500).send();
	Game.find({
		gameName: {$regex : req.body.searchvalue}
	}).toArray(function (err,docs){
		res.json(docs).status(200);
	});
});



module.exports = router;