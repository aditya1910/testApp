const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');
const conf = require('./config'); 

const mongoose = require('./lib/mongo');
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");

//============Public Rout========================//
const loginUser =  require('./routes/login');
const signup    =  require('./routes/signup');

//============client rout=======================//
const clientUser = require('./routes/users');
const clientContact = require('./routes/phoneNumber');

//=============admin rout============================//
const adminContact = require('./routes/admin/phoneNumber');
const adminUser =  require('./routes/admin/users');

const cors = require('cors')
const app = express();

app.use(cors())
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
app.use('/',signup)


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


app.use('/', clientUser);
app.use('/', clientContact);


app.use('/admin',function(req, res, next) {
    let decoded = req.decoded
    if(decoded.role=='ADMIN')
      next();
    else
      return res.json({msg: "You are not authorized"}).status(401);
});


app.use('/admin', adminUser);
app.use('/admin', adminContact);


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


