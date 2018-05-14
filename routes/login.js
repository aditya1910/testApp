const express = require("express");
const route = express.Router();
const ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const uuid = require("node-uuid");
const validate = require("validate.js");

function loginUser(req, res, next) {
  

  let db = req.db;
  let userEmail = req.body.userEmail || req.headers['userEmail'];
  let password  = req.body.password  || req.headers['password'];


  const constraints = {
    password: { presence: { message: "^password can't be blank." } },
    userEmail: { presence: { message: "^userEmail can't be blank." } }
  };

  const check = {
    userEmail: userEmail,
    password: password
  };
  console.log(check);

  let val = validate(check, constraints, { format: "flat" });
  console.log(val);

  if (val !== undefined)
  {
    console.log("yaya the user data is blank");
    return res.json({ data: val }).status(401);
  }

  let collection = db.collection('UserDetails');
  let obj = { "userEmail": userEmail,"password":password };
  try {
    collection.find(obj).toArray(function(err, user) {
      if (err) {
        res.json({
          msg: 'Error While Logging'
        }).status(500)
      } else {
        console.log(user);
        /*
          check if there is any matching user or not
         */
        console.log(user.length);
        if (user.length === 0) {
          console.log('no user found');
          return res.json({msg: "Authentication failed check your emil password." }).status(401);
        } else if (user.length >=1) {
            console.log("user found and credentials are correct.");
            //now create & send them the token
            const secret = uuid.v4();
            //update the secret to user object in db
            collection.update({ userEmail: userEmail }, { $set: { secret: secret } }, { upsert: true }, function(err, data) {
              if (err) {
                console.log("user's secret update error " + err);    
              } else {
                console.log("user logged in")
              }
            });
            console.log(user);
            const token = jwt.sign({ userEmail: userEmail,role:user[0].userRole},secret,{
              expiresIn: "24h"
            });
            res.json({token: token});
        }
      }
    });
  } catch (e) {
    console.log(e)
    db.close();
    res.status(200).json({ Status: 0, msg: "Error in login." });
  }
}

route.post('/login', loginUser);

module.exports = route;