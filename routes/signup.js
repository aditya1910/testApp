const express = require("express");
const route = express.Router();
const ObjectId = require("mongodb").ObjectID;
const validate = require("validate.js");

function signup(req, res, next) {
  console.log("here");
  
  let db = req.db;
  let userEmail = req.body.userEmail;
  let password  = req.body.password;
  let userRole  = req.body.userRole?req.body.userRole:'CLIENT';
  
  const constraints = {
    password: { presence: { message: "^password can't be blank." } },
    userEmail: { presence: { message: "^userEmail can't be blank." } },
  };

  const check = {
    userEmail: userEmail,
    password: password
  };
  

  let val = validate(check, constraints, { format: "flat" });
  console.log(val);

  if (val !== undefined)
    return res.json({ data: val }).status(401);

  let collection = db.collection('UserDetails');
  let obj = { "userEmail": userEmail};
  try {
    collection.find(obj).toArray(function(err, user) {
      if (err) {
        res.json({
          msg: 'Error While signup'
        }).status(500)
      } else {
        if (user.length === 0) {
            collection.insertOne({"userEmail":userEmail,"password":password,"userRole":"CLIENT"},(error,result)=>{
             if(error)
              res.json({
                msg: 'Error While signup'
              }).status(500)
             else
                return res.status(200).json({msg: "Welcome" });  
            })
          
        } else if (user.length >=1) {
            return res.json({msg:"Email already exist"}).status(401);
        }
      }
    });
  } catch (e) {
    db.close();
    res.json({msg:"Error in login."}).status(500);
  }
}

route.post('/signUp', signup);

module.exports = route;