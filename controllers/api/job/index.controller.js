const jobModel  = require(`${appRoot}/models/job.model`);
const applyjobModel  = require(`${appRoot}/models/applyjob.model`);
const jobService = require(`${appRoot}/services/job.js`);
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
const ObjectId = require('mongodb').ObjectId;

async function list(req, res){	
	console.log(req.query);
	const skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
	const limit = req.query.limit ? parseInt(req.query.limit): 10;
	let search = { deleted_at : 0, status : 1 }
	if(req.query.user_id){
		search.user_id = { $ne : new ObjectId(req.query.user_id) }
	}
	if(req.query.category_id){
		search.category_id =  new ObjectId(req.query.category_id)
	}
	if(req.query.subcategory_id){
		search.subcategory_id = { $in : req.query.subcategory_id }
	}
	if(req.query.keyword){
		search.name = { '$regex' : req.query.keyword };
	}
	if(req.query.city_id){
		search.city_id =  new ObjectId(req.query.city_id)
	}
	if(req.query.locality){
		search.locality_id = new ObjectId(req.query.locality)
	}

	if(req.query.exp_min && req.query.exp_max){
		search.exp_min = { $gte : parseInt(req.query.exp_min)}
		search.exp_max = { $lte : parseInt(req.query.exp_max)}		
	}
	if(req.query.salary_min && req.query.salary_max){
		search.salary_min = { $gte : parseInt(req.query.salary_min)}
		search.salary_max = { $lte : parseInt(req.query.salary_max)}
	}
	if(req.query.jobtype){
		const data = req.query.jobtype;
		const job_id = data.split(',');
		console.log(job_id);
		search.jobtype = { $in : job_id }
	}
	let sort_by = -1;
	if(req.query.sort == 'oldest'){
		sort_by = 1;
	}
	console.log(search)	
	const total_record = await jobModel.find(search);
	jobModel.aggregate([
		{
			$match : search
		},
		{
			$sort : sort_by
		},
		{ 
			$skip : skip 
		},
		{ 
			$limit : limit 
		}
	], function(error, record){
		console.log(error);
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record, total_record : total_record.length });
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
	if(job){
		return res.send({ status : HttpStatus.OK, code : 0, message : req.__('You have already apply for this job'), data : {} })
	}else{
		await applyjobModel.create(create_job);
		return res.send({ status : HttpStatus.OK, code : 0, message : req.__("Job has beeb apply successfully"), data : {} });
	}
}

async function createJob(req, res){
	try{
		const jobData = await jobService.addJob(req.body);			  
		if(jobData){
			return res.send({ status : HttpStatus.OK, code : 0, message : req.__('Job create successfully'), data : {} })
		}
	}catch(err){
		console.log(err)
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}	
	
}

async function editJob(req, res){
	try{
		const jobData = await jobService.editJob(req.body.id, req.body);
		if(jobData){
			return res.send({ status : HttpStatus.OK, code : 0, message : req.__('Job update successfully'), data : {} })
		}
	  }catch(err){
		console.log(err)
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	  }  	
}

async function delete_job(req, res){
	try{
		const jobData = await jobModel.updateOne({ _id: req.query.id }, { deleted_at: 1 });
		if(jobData){
			return res.send({ status : HttpStatus.OK, code : 0, message : req.__('Job delete successfully'), data : {} })
		}
	}catch(err){
		console.log(err)
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}  	
}

async function job_status(req, res){
	try{
		const jobData = await jobModel.updateOne({ _id: req.query.id }, { status : parseInt(req.query.status)});
		if(jobData){
			return res.send({ status : HttpStatus.OK, code : 0, message : req.__('Job status change successfully'), data : {} })
		}
	}catch(err){
		console.log(err)
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}  	
}


module.exports = {		
	list,
	deatils,
	applyjob,
	createJob,
	editJob,
	delete_job,
	job_status
}
