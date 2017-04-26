var express = require('express');
var passport = require('passport');
var fs = require("fs");
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

var Submission = require('../models/checkpointSubmission');
var Pointshistory = require('../models/pointHistory');
var User  = require('../models/user');
var GamePlayer = require('../models/gamePlayer');
var Game = require('../models/game');
var Checkpoint = require('../models/checkpoint');


// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') });
});

// process the login form
// app.post('/login', do all our passport stuff here);

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// process the signup form
// app.post('/signup', do all our passport stuff here);

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile',isLoggedIn, function(req, res) {
    res.render('profile', {
        newUser: req.user,
        user : req.user, // get the user out of session and pass to template
        edit : true
    });
});

router.get('/profile/:id',isLoggedIn,function (req,res) {
    if(!req.params.id){
        res.status(404).send();
    }
    else{
        User.find({_id:ObjectId(req.params.id)},function (err,user) {
            if(err){res.status(500).send()}
            if(user) {
                console.log(user[0]);
                res.render('profile', {
                    username:user[0],
                    newUser: user[0],
                    edit: false
                });
            }
            if(!user){res.status(404).send();}
        });

    }
});

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/home',
    failureRedirect : '/'
}));



router.get('/', function(req, res, next) {
  res.render('index', { message: req.flash('loginMessage') });
});

router.get('/games',isLoggedIn, function(req, res, next) {
  res.render('games', { title: 'PhotoFind - Games'});
});



router.get('/scoreboard',isLoggedIn, function(req, res, next) {
    User.find({},function (err,user) {
        if(err){res.status(500).send();}

        res.render('scoreboard',{userData:user.sort(Sorter)});

    });

});

router.get('/home',isLoggedIn,function (req,res,next) {
    var gameStore = [];
    var createdGames = [];
    GamePlayer.find({},function (err,games) {
        gameStore = games;
    });
    Game.find({userID:req.user._id},function (err,games) {
        res.render('home',{games:games});
    });

});
router.get('/creategame',isLoggedIn,function (req,res,next) {
   res.render('createGame');
});
/* USING API NOW

router.post('/creategame',isLoggedIn,function (req,res,next) {
   game = new Game();
   hist = new Pointshistory();
   console.log(req.file);

   hist.userID = req.user._id;



   game.userID = req.user._id;

   game.gameName = req.body.name;
   game.gameDifficulty = req.body.diff;
   game.gameInfo = req.body.info;
   game.gameCity = req.body.city;
   game.gameCountry = req.body.country;
   game.active = true;
   //game.gamePhoto = (req.body.img);

   game.save(function (err) {
      if(err){console.log(err);}
      else{console.log(game);}

      var checkpoint = new Checkpoint();
      checkpoint.gameID = game._id;
      checkpoint.checkpointImg = req.body.img;
      checkpoint.checkpointHint = req.body.description;
      checkpoint.save(function (err) {
          hist.gameID = game._id;
          hist.points = 100;
          hist.save(function (err) {
              if(err){res.status(500).send();}
              if(!err){
                  User.find({_id:ObjectId(req.user._id)},function (err,user) {
                      user[0].local.totalPoints = user[0].local.totalPoints + 100;
                      res.redirect('/home');
                  });
              }
          });
          if(err){res.status(500).send();}

      });


   });


}); */

router.get('/addCheckpoint',isLoggedIn, function(req, res) {
    res.render('addCheckpoint', {
        gameID: req.query.gameid,
    });
});

router.get('/updateAccount',isLoggedIn, function (req, res, next){
    res.render('updateAccount')
});

router.get('/game_checkpoints',isLoggedIn, function (req, res, next){
    res.render('game_checkpoints');
});

router.get('/checkpoint_page',isLoggedIn, function (req, res, next){
    res.render('checkpoint_page', { title: 'PhotoFind - Checkpoint'})
});

router.get('/unchecked_photos',isLoggedIn, function (req, res, next){
    res.render('unchecked_photos', { title: 'PhotoFind - Unchecked photos'})
});

router.get('/all_photos',isLoggedIn, function (req, res, next){
    res.render('all_photos', { title: 'PhotoFind - All photos'})
});

/*
router.post('/submission',isLoggedIn,function (req,res,next) {
    var sub = Submission();
    sub.userID = req.user._id;
    sub.username = req.user.username;
    sub.submissionPhoto = req.body.img;
    sub.save(function (err) {
        if(err)res.status(500).send();
        else{res.redirect('/home');}
    })
});
*/

router.post('/updateAccount',isLoggedIn,function (req,res) {
    User.find({_id:ObjectId(req.user._id)},function (err,user) {
        if(err){res.status(500).send();}
        if(!user){res.status(404).send();}

        if(user){
            console.log(user);
            if(req.body.username ){user.local.username = req.body.username;}
            res.redirect('/profile');
        }
        res.status(500).send();
    });
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    if(!req.user){
        res.redirect('/');
    }
    else {
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
}

function Sorter(a, b) {
    if (a.totalPoints < b.totalPoints) {
        return -1;
    }
    if (a.totalPoints > b.totalPoints) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

module.exports = router;
