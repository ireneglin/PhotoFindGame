var express = require('express');
var passport  = require('passport');
var User  = require('../models/user');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var router = express.Router();
var GamePlayer = require('../models/gamePlayer');
var Game = require('../models/game');
var PlayerBadge = require('../models/playerBadges');
var Badge = require('../models/badges');
var PointHistory = require('../models/pointHistory');
var async = require('async');

router.get('/',function (req,res) {
    User.find({},function (err,user) {
        if(err)res.status(500).send();
        if(user)res.status(200).json(user);
    });
});

router.get('/profile/:id',function (req,res) {
    User.find({'_id': ObjectId(req.params.id)},function (err,user) {
        if(err)res.status(500).send();
        if(user)res.status(200).json(user);
        if(!user)res.status(404).send()

    });
});



router.get('/logout', function (req,res) {
   res.logout();
   res.status(200).send();
});


router.post('/signup',function (req,res,next) {
    console.log(req.body.email);
    User.findOne({ 'local.email': req.body.email }, function (err, user) {
        console.log(user,err);
        if(!user){
            var newUser   = new User();
            newUser.local.email = req.body.email;
            newUser.local.password = newUser.generateHash(req.body.password);
            newUser.local.active = false;
            newUser.save(function (err) {

                if(err){console.log(err); res.status(500).send();}
                else res.status(200).send();
            });


        }
        else{
            res.status(401).send();
        }



    });
    res.status(200).send();
});



router.get('/validate/:id',function (req,res) {
    User.findOne({ 'local.confirmToken' :  req.params.id }, function(err, user){
        if(err) res.status(500).send();
        if(!user) res.status(404).send();
        if(user){
            user.local.confirmToken = null;
            user.local.active = true;
            user.save(function(err) {
                if (err) res.status(500).send();
                res.status(200).send();
            });
        }
    });

});


router.post('/login',function (req,res) {
    User.findOne({ 'local.email': req.body.email }, function (err, user) {
        if(!user){res.status(404).send();}
        else{
          console.log(user);
            if(user.validPassword(req.body.password)) res.status(200).send();
            if(!user.validPassword(req.body.password)){res.status(403).send();}
        }
    });
});



router.get('/',function (req,res) {
    User.find({},function (err,user) {
        if(err) res.status(500).send();
        res.json(user).send();
    })
});

router.put('/editProfile/:id',function (req,res) {
   User.findOne({"_id":ObjectId(req.params.id)},function (err,user) {
       if(err)res.status(500).send();
       if(!user)res.status(404).send();
       if(user){
           if(req.body.email) user.local.email = req.body.email;
           if(req.body.password) user.local.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
           user.save(function(err) {
               if (err) res.status(500).send();
               res.status(200).send();
           });
       }
   });
});

/*POST
Endpoint: /:userID/updateAccount
Description: Edit account details
Input: firstname, lastname, username, country, city, active, isadmin
Output: HTTP OK (send them to their game page)
*/
router.post('/updateAccount', function(req, res) {

        User.collection.findOneAndUpdate(
          {_id: req.user._id}, 
          {$set:  {
                              "local.firstName": req.body.firstName,
                              "local.lastName": req.body.lastName,
                              "local.username": req.body.username,
                              "local.country": req.body.country,
                              "local.city": req.body.city,
                              "local.active": (req.body.active == "true"),
                              "local.idAdmin": (req.body.isAdmin == "true")
                            }
                 
          },
          {returnNewDocument: true
          }, function(err, result) {
          if(err || !result) res.status(500).send();
          res.status(200).send();
      });
});


 router.get('/gamesplaying', function(req,res){
      var userid;
     var resGames = [];
      if (req.query.userid !== undefined)
         {
             userid = req.query.userid;
         }
     else if (req.user) {
         userid = req.user._id.toString();
     }
 
     if (userid) {
     GamePlayer.collection.find({userID: userid}, {gameID:1, _id: 0}).toArray(function(err,items) {
         for (var i=0; i < items.length; i++) {
             resGames.push(items[i].gameID);
         }
         Game.collection.find({ gameID : { $in: resGames }}, { _id: 1, gameName: 1, gameDifficulty: 1, gameCity: 1, gameCountry: 1})
              .toArray(function(err, theGame ) {
                  console.log("games are: "+theGame);
                  res.json(theGame).status(200);
              });
     });
     }
     else {
     res.status(404).send();
     }
 });


router.get('/gamesplayingbis', function (req,res){
     var userid;
     var resGames = [];
      if (req.query.userid !== undefined)
         {
             userid = req.query.userid;
         }
     else if (req.user) {
         userid = req.user._id.toString();
     }
     var games = [];
       GamePlayer.collection.find({
         userID: userid
       }).toArray(function (err, docs){
         console.log(docs);
         var i;
         for(i=0;i<docs.length;i++){
           games.push(docs[i].gameID);
         }
         res.status(200).send(games);
       });
  })


router.get('/gameshosting', function (req,res){
    var userid;
     if (req.query.userid !== undefined)
        {
            userid = req.query.userid;
        }
    else if (req.user) {
        userid = req.user._id.toString();
    }

    if (userid) {
    Game.collection.find({userID: userid}, { _id: 1, gameName: 1, gameDifficulty: 1, gameCity: 1, gameCountry: 1}).toArray(function(err,docs){
      res.json(docs).status(200);
    });
    }
    else {
    res.status(404).send();
    }
});


router.get('/scoreboard', function (req,res){
    var searchQuery ={};
    if (req.query.city == "true") {
        searchQuery['local.city'] = req.user.local.city;
    }
    if (req.query.country == "true") {
       searchQuery['local.country'] = req.user.local.country;
    }
    searchQuery['local.active'] = true;
    searchQuery['local.totalPoints'] = {$gt: 0};
    
    User.collection.find(searchQuery, {"local.username" : 1, "local.city":1, "local.country":1, "local.totalPoints":1}).sort({
        'local.totalPoints': -1
    }).toArray(function (err,docs){
        res.json(docs).status(200);
    });
});


router.get('/badges/:id', function (req,res){
  if(!req.params.id) res.status(404).send();
  PlayerBadge.collection.find({
      userID: req.params.id
   }).toArray(function (err,docs){
    var badgesID = [];
    var i;
    for(i=0; i<docs.length; i++){
      badgesID.push(docs[i].badgeID);
    }
    res.json(badgesID).status(200).send();
    /*var i;
    var result = [];
    for(i=0; i<docs.length; i++){
      Badge.collection.find({
        badgeID: docs[i].badgeID
      }, function (game){
        result.push(game);
      });
      
    }*/
  });
});

router.post('/:id/seehint', function (req,res){
  if(!req.params.id) res.status(404).send();
  else{
    PointHistory.collection.insertOne({
      userID: req.user._id.toString(),
      gameID: req.params.id,
  	  date : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      points: "-5",
      activityType: "Hint View!"
    });
    User.collection.findOneAndUpdate(
             { "_id" : req.user._id },
             { $inc : { "local.totalPoints" : -5 } }
        );
    res.status(200).send();
  }
});


router.get('/pointhistory', function (req,res,next){
    var userid;
     if (req.query.userid !== undefined)
        {
            userid = req.query.userid;
        }
    else if (req.user) {
        userid = req.user._id.toString();
    }

    if (userid) {
    PointHistory.collection.find({userID: userid}, { _id: 0, gameID: 1, date: 1, points: 1, activityType: 1 }).toArray(function(err,docs){
      res.json(docs).status(200);
    });
    }
    else {
    res.status(404).send();
    }
});


module.exports = router;
