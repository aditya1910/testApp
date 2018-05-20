var express = require('express');
var router = express.Router();
const validate = require("validate.js");
/* GET users listing. */
router.get('/user', function(req, res, next) {
	let db = req.db;
	let decoded = req.decoded

	db.collection("UserDetails").findOne({userEmail:decoded.userEmail},(error,result)=>{
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
	// create user 
	let userEmail = req.decoded.userEmail;
	let password = req.password;
	let db       = req.db;

	const constraints = {
    	password: { presence: { message: "^password can't be blank." } },
  	};

  const check = {
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

module.exports = router;
	