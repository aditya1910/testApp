var express = require('express');
var router = express.Router();
const validate = require("validate.js");
/* GET users listing. */
router.get('/user', function(req, res, next) {
	let db = req.db;
	let decoded = req.decoded

	dn.collection("UserDetails").findOne({userEmail:decoded.userEmail},(error,result)=>{
		if(error){
			return res.status(500).json({msg: "Error" });
		}else if(result==null){
			return res.status(200).json({msg: "No user found" });
		}else{
			return res.json({result:result,msg: "No user found" });
		}
	})
});


router.post('/user', function(req, res, next) {
	// create user 
	let userEmail = req.userEmail;
	let password = req.password;
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
  {
    console.log("yaya the user data is blank");
    return res.json({ data: val }).status(401);
  }   

  db.collection("UserDetails").insertOne({userEmail:userEmail,password:password},(error,result)=>{
  	if(error)
  		return res.json({msg:"Ereor "}).status(500);
  	else 
  		return res.json({msg:"welcome"})
  })

});

module.exports = router;
