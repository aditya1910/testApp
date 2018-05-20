var express = require('express');
var router = express.Router();
const validate = require("validate.js");
const helper   = require('../lib/helper');

router.get('/contacts', function(req, res, next) {
  
  let db = req.db;
  let userEmail = req.decoded.userEmail
  let pageNumber = req.query.pageNumber?req.query.pageNumber:0;
  let offSet = pageNumber*10;
  
	db.collection("contactNumber").find({userEmail:userEmail}).skip(offSet).limit(10).toArray((error,result)=>{
		if(error){
			return res.status(500).json({msg: "Error" });
		}else if(result==null){
			return res.status(200).json({msg: "No user found" });
		}else{
			return res.json({result:result});
		}
	})
});

router.post('/contacts', function(req, res, next) {
	
  let userEmail     = req.decoded.userEmail;
	let contactNumber = req.body.contactNumber;
	let label         = req.body.label;
	let db            = req.db;

  console.log(contactNumber,label)
	const constraints = {
    	label: { presence: { message: "^label can't be blank." } },
    	contactNumber: { presence: { message: "^contactNumber can't be blank." } }
  	};

  const check = {
    contactNumber: contactNumber,
    label: label
  };
  

  let val = validate(check, constraints, { format: "flat" });
  
  if (val !== undefined)
    return res.json({ data: val }).status(401);

  if(!helper.valicateContactNumber(contactNumber))
      return res.json({msg:'enter a valid phone number'});      

  db.collection('contactNumber').findOne({userEmail:userEmail,contactNumber:contactNumber,label:label},(error,result)=>{
    if(error || result!=null)
      return res.json({ data: "contact number allready exist"})
    else{
        db.collection("contactNumber").insertOne({userEmail:userEmail,contactNumber:contactNumber,label:label},(error,result)=>{
        if(error)
          return res.json({msg:"Some error occured "}).status(500);
        else 
          return res.json({msg:"Inserted"});
      })
    }
  })

});

router.delete('/contacts', function(req, res, next) {
  
  let userEmail     = req.decoded.userEmail;
  let label         = req.body.label;
  let db            = req.db;

  const constraints = {
      label: { presence: { message: "^label can't be blank." } },
    };

  const check = {
    label: label
  };

  let val = validate(check, constraints, { format: "flat" });
  
  if (val !== undefined)
    return res.json({ data: val }).status(401);

  db.collection('contactNumber').remove({userEmail:userEmail,label:label},{justOne:1},(error,result)=>{
    console.log(result)
    if(error)
      return res.json({ data: "No contact found"})
    else
      return res.json({msg:"contact deleted"});
  })

});


router.put('/contacts', function(req, res, next) {
  
  let userEmail     = req.decoded.userEmail;
  let contactNumber = req.body.contactNumber;
  let label         = req.body.label;
  let db            = req.db;

  const constraints = {
      label: { presence: { message: "^label can't be blank." } },
      contactNumber: { presence: { message: "^contactNumber can't be blank." } }
    };

  const check = {
    contactNumber: contactNumber,
    label: label
  };
  console.log(check);

  let val = validate(check, constraints, { format: "flat" });
  
  if (val !== undefined)
    return res.json({ data: val }).status(401);

  if(!helper.valicateContactNumber(contactNumber))
      return res.json({msg:'enter a valid phone number'});      

  db.collection('contactNumber').findOne({userEmail:userEmail,label:label},(error,result)=>{
    if(error || result==null)
      return res.json({ data: "No contact number found"})
    else{
        db.collection("contactNumber").updateOne({userEmail:userEmail,label:label},{$set:{contactNumber:contactNumber}},(error,result)=>{
        if(error)
          return res.json({msg:"Some error occured "}).status(500);
        else 
          return res.json({msg:"Updated"});
      })
    }
  })

});





module.exports = router;
	