var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
const conf = require('./config'); 
var usersRouter = require('./routes/users');
const loginUser = require('./routes/login');
const signup = require('./routes/signup');
const mongoose = require('./lib/mongo');
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  req.db = mongoose.db; 
  req.rootPath = __dirname + '/';
  next();

});

app.use('/', loginUser);


app.use(function(req, res, next) {
  const token     = req.headers["x-access-token"];
  const userEmail = req.headers["useremail"];


  let db = req.db;
  let collection = db.collection('UserDetails');
        //check and verify the token using secret
        collection.findOne({"userEmail":userEmail},(error,result)=>{
        	if(error || result == null){
        		return res.json({msg: "Authentication failed " }).status(401);
        	}else{
        		console.log(result)
        		jwt.verify(token, result.secret, function(err, decoded) {
		          if (err) {
		            log.error({
		              msg: "Authentication Failed. Error while verifying jwt token.",
		              errorDetails: err
		            });
		            log.debug({
		              msg: "Authentication Failed. Error while verifying jwt token.",
		              errorDetails: err
		            });
		            console.log("error occured in token verification middleware. or token expired");
		            return res.status(401).json({msg: "Token Invalid or Your login session is expired kindly login again."});
		          }
		          console.log(decoded,"decode");
		          req.decoded = decoded;
		          console.log(req.decoded,"this is the response");
		          next();
		        });	
        	}	
        })       
});


app.use('/', signup);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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


