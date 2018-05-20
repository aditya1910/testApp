var valicateContactNumber = function (contactNumber){
	if(contactNumber.length==10 && contactNumber.match(/^[0-9]+$/) != null)
		return true;
	else 
		return false;		
}

module.exports.valicateContactNumber = valicateContactNumber;

//export valicateContactNumber