var express    = require('express');
var router     = express.Router();
const validate = require("validate.js");
const helper   = require('../../lib/helper');


router.get('/contacts', function(req, res, next) {

  let db = req.db;
  let pageNumber = req.query.pageNumber?req.query.pageNumber:0;
  let offSet = pageNumber*10;

	db.collection("contactNumber").find({}).skip(offSet).limit(10).toArray((error,result)=>{
    console.log(error,result);
		if(error){
			return res.json({msg: "Error" }).status(500);
		}else if(result==null){
			return res.json({msg: "No record found" });
		}else{
			return res.json({result:result});
		}
	})
});

router.post('/contacts', function(req, res, next) {
  
  let userEmail     = req.body.userEmail;
  let contactNumber = req.body.contactNumber;
  let label         = req.body.label;
  let db            = req.db;

  const constraints = {
      userEmail: { presence: { message: "^email can't be blank." } },
      label: { presence: { message: "^label can't be blank." } },
      contactNumber: { presence: { message: "^contactNumber can't be blank." } }
    };

  const check = {
    userEmail: userEmail,
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

router.put('/contacts', function(req, res, next) {
  
  let userEmail     = req.body.userEmail;
  let contactNumber = req.body.contactNumber;
  let label         = req.body.label;
  let db            = req.db;

  const constraints = {
      userEmail: { presence: { message: "^email can't be blank." } },
      label: { presence: { message: "^label can't be blank." } },
      contactNumber: { presence: { message: "^contactNumber can't be blank." } }
    };

  const check = {
    userEmail: userEmail,
    contactNumber: contactNumber,
    label: label
  };
  

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

router.delete('/contacts', function(req, res, next) {
  
  let userEmail     = req.body.userEmail;
  let label         = req.body.label;
  let db            = req.db;

  const constraints = {
      userEmail: { presence: { message: "^email can't be blank." } },
      label: { presence: { message: "^label can't be blank." } },
    };

  const check = {
    userEmail: userEmail,
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

module.exports = router;
	