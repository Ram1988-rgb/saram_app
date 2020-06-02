const jobModel  = require(`${appRoot}/models/job.model`);
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
const ObjectId = require('mongodb').ObjectId;

async function list(req, res){
	let record = {};
	record.city = await commanHelper.getCity();
	record.lKnow = await commanHelper.langKnown();
	record.adProof = await commanHelper.addressProof();
	record.pIdProof = await commanHelper.photoIdProof();
	record.designaitor = await commanHelper.allDesignaitor();
	record.skills = await commanHelper.allSkills();		
	return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
}

module.exports = {		
	list
}
