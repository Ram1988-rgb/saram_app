const jobModel  = require(`${appRoot}/models/job.model`);
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
const ObjectId = require('mongodb').ObjectId;

async function list(req, res){
	let record = {};
	record.country = await commanHelper.getCountry();
	record.city = await commanHelper.getCity();	
	record.locality = await commanHelper.getlocalityList()
	record.language = await commanHelper.langKnown();
	record.proof = await commanHelper.addressProof();
	record.jobTypes = await commanHelper.jobType();
	record.category = await commanHelper.getCategory();	
	return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
}

module.exports = {		
	list
}
