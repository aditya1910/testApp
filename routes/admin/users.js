var express = require('express');
var router = express.Router();
const validate = require("validate.js");
/* GET users listing. */
router.get('/user', function(req, res, next) {
	let db = req.db;
	let pageNumber = req.query.pageNumber?req.query.pageNumber:0;
  let offSet     = pageNumber*10;

	db.collection("UserDetails").find({}).skip(offSet).limit(10).toArray((error,result)=>{
		if(error){
			return res.status(500).json({msg: "Error" });
		  }else if(result==null){
			return res.status(200).json({msg: "No user found" });
		}else{
			return res.json({result:result});
		}
	})
});

router.put('/user', function(req, res, next) {
  let userEmail = req.body.userEmail;
  let password = req.password;
  let db       = req.db;

  const constraints = {
      userEmail: { presence: { message: "^email can't be blank." } },
      password: { presence: { message: "^password can't be blank." } },
    };

  const check = {
    userEmail: userEmail,
    password: password
  };
  
  let val = validate(check, constraints, { format: "flat" });
  console.log(val);

  if (val !== undefined)
    return res.json({ data: val }).status(401);
  
  db.collection("UserDetails").updateOne({userEmail:userEmail},{$set:{password:password}},(error,result)=>{
    if(error)
      return res.json({msg:"Ereor "}).status(500);
    else 
      return res.json({msg:"password updated"})
  })
});

router.post('/user', function(req, res, next) {
	// create user 
	let userEmail = req.body.userEmail;
	let password = req.body.password;
  let userRole = req.body.userRole?req.body.userRole:"CLIENT";
  let db       = req.db;
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
    return res.json({ data: val }).status(401);

  db.collection("UserDetails").findOne({userEmail:userEmail},(error,result)=>{
    if(error)
      res.json({msg:"some error in creating user"}).status(500);
    else if(result!=null){
      res.json({msg:"User already exixt"});
    }else{
        db.collection("UserDetails").insertOne({userEmail:userEmail,password:password,userRole:userRole},(error,result)=>{
          if(error)
            return res.json({msg:"Ereor "}).status(500);
          else 
            return res.json({msg:"User created"}).status(201);
        })    
    }
  })
});

router.delete('/user', function(req, res, next) {
  
  let userEmail     = req.body.userEmail;
  let db            = req.db;

  const constraints = {
      userEmail: { presence: { message: "^email can't be blank." } },
    };

  const check = {
    userEmail: userEmail,
  };

  let val = validate(check, constraints, { format: "flat" });
  
  if (val !== undefined)
    return res.json({ data: val }).status(401);

  db.collection('UserDetails').remove({userEmail:userEmail},{justOne:1},(error,result)=>{
    console.log(result)
    if(error)
      return res.json({ data: "No contact found"})
    else
      return res.json({msg:"contact deleted"});
  })
});


module.exports = router;
	