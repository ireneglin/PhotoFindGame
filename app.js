var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');
var busboy = require('connect-busboy');
var fileUpload = require('express-fileupload');
var database = require('./config/database');
var env = require('./config/env');
var User = require('./models/user');
var ObjectId = require('mongoose').Types.ObjectId;
require('./config/passport')(passport);


//Routes
var checkpoints = require('./routes/checkpoints');
var games = require('./routes/games');
var index = require('./routes/index');
var users = require('./routes/users');
var badges = require('./routes/badges');
var admin = require('./routes/admin');

var app = express();

//connect to database
mongoose.connect(database.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





app.use(session({ secret: env.session,  resave: false, saveUninitialized: false  })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function(req, res, next) {res.locals.user = req.user;next();});


app.use('/api/games',games);
app.use('/api/checkpoint', checkpoints);
app.use('/', index);
app.use('/api/users', users);
app.use('/api/badges', badges);
app.use('/api/admin', admin);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
