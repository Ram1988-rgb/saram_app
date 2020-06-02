const jobModel  = require(`${appRoot}/models/job.model`);
const applyjobModel  = require(`${appRoot}/models/applyjob.model`);
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
const ObjectId = require('mongodb').ObjectId;

async function list(req, res){	
	const skip = parseInt(req.query.skip);
	const limit = parseInt(req.query.limit);
	let search = { deleted_at : 0, status : true }
	if(req.query.user_id){
		search.user_id = new ObjectId(req.query.user_id)
	}
	console.log(search)	
	jobModel.aggregate([
		{
			$match : search
		},
		{ 
			$skip : skip 
		},
		{ 
			$limit : limit 
		}
	], function(error, record){
		console.log(error);
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
	});	
}

async function deatils(req, res){	
	jobModel.aggregate([
		{
			$match : 
			{
				_id : new ObjectId(req.query.id), deleted_at : 0, status : true
			}
		},
		{
			$lookup :
			{
				from : "users",
				localField : "user_id",
				foreignField : '_id',
				as : "user_data"
			}
		}
	], function(error, record){
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
	});	
}

async function applyjob(req, res){
	console.log(req.query);
	const job = await applyjobModel.findOne({ job_id : new ObjectId(req.query.job_id), user_id : new ObjectId(req.query.user_id), status : true, deleted_at : 0});
	const create_job = {
		user_id : new ObjectId(req.query.user_id),
		job_id : new ObjectId(req.query.job_id),
		status : true,
		deleted_at : 0
	}
	console.log(create_job);
	if(!job){
		await applyjobModel.create(create_job);
		return res.send({ status : HttpStatus.OK, code : 0, message : req.__('You have already apply for this job'), data : {} })
	}else{
		return res.send({ status : HttpStatus.OK, code : 0, message : req.__("Job has beeb apply successfully"), data : {} });
	}
}


module.exports = {		
	list,
	deatils,
	applyjob
}
