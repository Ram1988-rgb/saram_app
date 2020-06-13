const userService = require(`${appRoot}/services/admin/user`);
const userModel  = require(`${appRoot}/models/user.model`);
const userProfileModel  = require(`${appRoot}/models/userProfile.model`);
const applyjobModel  = require(`${appRoot}/models/applyjob.model`);
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const constant = require(`${appRoot}/config/constant`);
const {constants} = require(`${appRoot}/config/string`);
const utils = require(`${appRoot}/middleware/utils`)
const bcrypt = require("bcrypt-nodejs");
const async = require("async");
const HttpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

async function login (req, res){
	try{
		var result = {};
		const record = await userModel.findOne({ mobile : parseInt(req.body.mobile), deleted_at : 0});
		if(record){
			if(record.status == false){
				return res.send({status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("User Inactive please contact to admin")});
			}
			else if(bcrypt.compareSync(req.body.password, record.password)){
				const token = await utils.generate_token(record);
				return res.send({status:HttpStatus.OK, code : 0, data:record, message:"", token:token});
			}			
			else{
				return res.send({status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Password does not match")});
			}
		}else{
			return res.send({status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Mobile number not exists")});
		}
	}catch(err){
		return res.json({status:false, code:1, message:constants.SOMETHING_WENT_WRONG});
	}
}
	
async function registration(req, res){
	var result = {};
	const record = await userModel.findOne({ mobile : parseInt(req.body.mobile), status : true, deleted_at : 0});
	if(record){
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, message : req.__("Mobile number already in used, please choose another number"), data : {}});
	}else{
		try{
			req.body.createdby = 'mobile';
			const imageProof = await commanHelper.uploadFile(req.files,'photo_proof',constant.UPLOAD_USER_PHOTOID)
			const imageProfile = await commanHelper.uploadFile(req.files,'photo_profile',constant.UPLOAD_USER_PROFILE)
			if(imageProof){
				req.body.photoId = imageProof;
			}
			if(imageProfile){
				req.body.image = imageProfile;
			}
			const userData = await userService.add(req);
			if(userData){
				return res.send({ status : HttpStatus.OK, code : 0, message : req.__("Profile has beeb created successfully"), data : userData});
			}
		}catch(err){
			return res.send({ status : HttpStatus.FORBIDDEN, code : 1, message : req.__("Something went wrong"), data : {}});
		}
	}		
}
	
async function updateprofile(req, res){
	var result = {};
	const record = await userModel.findOne({ _id : { $ne : new ObjectId(req.body.id)}, mobile : parseInt(req.body.mobile), status : true, deleted_at :0});
	if(record){
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, message : req.__("Mobile number already in used, please choose another number"), data : {}});
	}else{
		try{
			const imageProof = await commanHelper.uploadFile(req.files,'photo_proof',constant.UPLOAD_USER_PHOTOID)
			const imageProfile = await commanHelper.uploadFile(req.files,'photo_profile',constant.UPLOAD_USER_PROFILE)
			if(imageProof){
				req.body.photoId = imageProof;
			}
			if(imageProfile){
				req.body.image = imageProfile;
			}
			const userData = await userService.edit(req.body.id, req);
			if(userData){
				return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
			}
		}catch(err){
			return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
		}	
	}				
}

async function applyjob(req, res){
	const skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
	const limit = req.query.limit ? parseInt(req.query.limit): 10;
	const total_record = await applyjobModel.find({ user_id : new ObjectId(req.query.user_id), deleted_at : 0, status : true });
	applyjobModel.aggregate([
		{
			$match : 
			{
				user_id : new ObjectId(req.query.user_id), deleted_at : 0, status : true
			}
		},
		{
			$skip : skip
		},
		{
			$limit : limit 
		},
		{
			$lookup :
			{
				from : "jobs",
				localField : "job_id",
				foreignField : '_id',
				as : "job_data"
			}
		},
		{
			$unwind : "$job_data"
		},
		{
			$project :
			{
				name : "$job_data.name",
				salary_min : "$job_data.salary_min",
				salary_max : "$job_data.salary_max",
				exp_min : "$job_data.exp_min",
				exp_max : "$job_data.exp_max",
				jobtype : "$job_data.jobtype",
				job_id : 1

			}
		}
	], function(error, record){
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record, total_record : total_record.length});
	});	
}

async function getProfile(req, res){
	console.log(req.query);
	try{
		const userData = await userProfileModel.findOne({ user_id : new ObjectId(req.query.user_id), status: true, deleted_at : 0});
		console.log(userData);
		if(userData){
			return res.send({ status : HttpStatus.OK, code : 0, data : userData, message : ""});
		}
	}catch(err){
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}	
}

async function candidateSearch(req, res){	
	console.log(req.query);
	const skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
	const limit = req.query.limit ? parseInt(req.query.limit): 10;
	let search = { deleted_at : 0, status : true }
	
	if(req.query.name){
		search.company_name = { '$regex' : req.query.name };
	}
	if(req.query.city_id){
		search.city_id =  new ObjectId(req.query.city_id)
	}
	if(req.query.locality){
		search.locality_id = new ObjectId(req.query.locality)
	}
	if(req.query.jobtype){
		const data = req.query.jobtype;
		const job_id = data.split(',');
		console.log(job_id);
		search.employment_status = { $in : job_id }
	}
	console.log(search)	
	const total_record = await userProfileModel.find(search);
	const detail = await userProfileModel.find(search).populate('city_id user_id locality_id category_id skill_id language_id address_id photoproof_id');
	userProfileModel.aggregate([
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
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : detail, total_record : total_record.length });
	});	
}

module.exports = {
	login,
	registration,
	updateprofile,
	applyjob,
	getProfile,
	candidateSearch
}