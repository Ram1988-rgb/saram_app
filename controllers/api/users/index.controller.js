const userService = require(`${appRoot}/services/admin/user`);
const userModel  = require(`${appRoot}/models/user.model`);
const userProfileModel  = require(`${appRoot}/models/userProfile.model`);
const applyjobModel  = require(`${appRoot}/models/applyjob.model`);
const sortlisted_candidateModel  = require(`${appRoot}/models/sortlisted_candidate.model`);
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
				const save_device = await userService.save_device(req);
				return res.send({status:HttpStatus.OK, code : 0, data:record, message:"", token:token, profile : constant.SHOW_USER_PROFILE, id_proof : constant.SHOW_USER_PHOTOID});
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
				return res.send({ status : HttpStatus.OK, code : 0, message : req.__("Profile has beeb created successfully"), data : userData, profile : constant.SHOW_USER_PROFILE, id_proof : constant.SHOW_USER_PHOTOID});
			}
		}catch(err){
			return res.send({ status : HttpStatus.FORBIDDEN, code : 1, message : req.__("Something went wrong"), data : {}});
		}
	}		
}
	
async function updateprofile_old(req, res){
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

async function updateprofile(req, res){
	console.log(req.body);
	var update_data = {};	
	try{
		let profile_data = await userProfileModel.findOne({user_id : new ObjectId(req.body.user_id), parent_id : null});
		//console.log(profile_data);
		if(req.body.type == 'resume'){
			const resume = await commanHelper.uploadFile(req.files, 'resume', constant.UPLOAD_USER_RESUME)
			update_data.resume_name = resume ? resume : '';
			update_data.resume_title = req.body.resume_title ? req.body.resume_title : "";
			if(profile_data){
				const userData = await userService.updateProfile(profile_data._id, update_data);
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
			else{
				if(req.body.profile){
					update_data.parent_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				}
				update_data.user_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				const userData = await userService.createProfile(update_data);
				if(userData){
					await userModel.updateOne({ _id : req.body.user_id }, { seeker : 1 });
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}			
			
		}else if(req.body.type == "education"){
			//console.log(profile_data);
			update_data.education = req.body.education ? req.body.education : '';
			update_data.name_of_course = req.body.name_of_course ? req.body.name_of_course : '';
			update_data.year_of_passing = req.body.year_of_passing ? req.body.year_of_passing : "";
			if(profile_data){
				const userData = await userService.updateProfile(profile_data._id, update_data);
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
			else{
				if(req.body.profile){
					update_data.parent_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				}
				update_data.user_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				const userData = await userService.createProfile(update_data);
				if(userData){
					await userModel.updateOne({ _id : req.body.user_id }, { seeker : 1 });
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
		}
		else if(req.body.type == "current_employer"){
			update_data.company_name = req.body.company_name ? req.body.company_name : '';
			update_data.date_of_joining = req.body.date_of_joining ? req.body.date_of_joining : "";
			update_data.designation = req.body.designation ? req.body.designation : "";
			update_data.experience = req.body.experience ? parseInt(req.body.experience):0;
			update_data.current_salary = req.body.current_salary ? parseInt(req.body.current_salary):0;
			update_data.notice_period = req.body.notice_period ? parseInt(req.body.notice_period):0;
			update_data.employment_status = req.body.employment_status ? req.body.employment_status : [];
			if(profile_data){
				const userData = await userService.updateProfile(profile_data._id, update_data);
				
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
			else{
				if(req.body.profile){
					update_data.parent_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				}
				update_data.user_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				const userData = await userService.createProfile(update_data);
				if(userData){
					await userModel.updateOne({ _id : req.body.user_id }, { seeker : 1 });
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
		}
		else if(req.body.type == "skill"){
			update_data.skill_name = req.body.skills ? req.body.skills : '';
			if(profile_data){
				const userData = await userService.updateProfile(profile_data._id, update_data);
				
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
			else{
				if(req.body.profile){
					update_data.parent_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				}
				update_data.user_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				const userData = await userService.createProfile(update_data);
				if(userData){
					await userModel.updateOne({ _id : req.body.user_id }, { seeker : 1 });
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
		}
		else if(req.body.type == "location"){
			update_data.city_id = req.body.city_id;
			update_data.locality_id = req.body.locality_id ? req.body.locality_id : null;
			if(profile_data){
				const userData = await userService.updateProfile(profile_data._id, update_data);
				
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
			else{
				if(req.body.profile){
					update_data.parent_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				}
				update_data.user_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				const userData = await userService.createProfile(update_data);
				if(userData){
					await userModel.updateOne({ _id : req.body.user_id }, { seeker : 1 });
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
		}
		else if(req.body.type == "category"){
			update_data.category_id = req.body.category_id;
			let data = req.body.subcategory_id;
			let subcategory_id = data;
			if(typeof data == "string" && data){
				subcategory_id = data.split(',');
			}
			update_data.subcategory_id = subcategory_id ? subcategory_id : [];
			if(profile_data){
				const userData = await userService.updateProfile(profile_data._id, update_data);
				
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
			else{
				if(req.body.profile){
					update_data.parent_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				}
				update_data.user_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				const userData = await userService.createProfile(update_data);
				if(userData){
					await userModel.updateOne({ _id : req.body.user_id }, { seeker : 1 });
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
		}
		else if(req.body.type=='user_profile'){
			try{
				const imageProfile = await commanHelper.uploadFile(req.files,'photo_profile',constant.UPLOAD_USER_PROFILE)
				if(imageProfile){
					req.body.image = imageProfile;
				}
				console.log(req.body);
				const userData = await userService.edit(req.body.user_id, req);
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}
			}catch(err){
				return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
			}		
		}
		else if(req.body.type == "other"){
			console.log(req.body);
			update_data.passport = (req.body.passport && req.body.passport == 'yes') ? true : false;
			update_data.diploma = (req.body.diploma && req.body.diploma == 'yes') ? true : false;
			//update_data.address_id = req.body.adProof;
			//update_data.photoproof_id = req.body.pIdProof;
			let language = req.body.language;
			let language_id = language;
			if(typeof language == "string"){
				language_id = language.split(',');
			}
			update_data.language_id = language_id;
			let user_update_data = {};			
			const imageProof = await commanHelper.uploadFile(req.files,'photo_proof',constant.UPLOAD_USER_PHOTOID)
			if(req.body.photo_id_type){
				user_update_data.photo_type_id = new ObjectId(req.body.photo_id_type);
				user_update_data.photo_id_number = req.body.photo_id_number ? req.body.photo_id_number : '';
				user_update_data.photo_proof = imageProof ? imageProof : '';
				await userModel.updateOne({ _id : req.body.user_id }, user_update_data);
			}
			if(profile_data){
				const userData = await userService.updateProfile(profile_data._id, update_data);
				console.log(userData);
				if(userData){
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
			else{
				if(req.body.profile){
					update_data.parent_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				}
				update_data.user_id = req.body.user_id ? new ObjectId(req.body.user_id) : null;
				const userData = await userService.createProfile(update_data);
				if(userData){
					await userModel.updateOne({ _id : req.body.user_id }, { seeker : 1 });
					return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
				}else{
					return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
				}
			}
		}
		else{
			const userData = await userService.addUserProfile(req);
			if(userData){
				return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
			}else{
				return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
			}
		}
		
	}catch(err){
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
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
	try{
		//const userData = await userProfileModel.findOne({ user_id : new ObjectId(req.query.user_id), status: true, deleted_at : 0});
		let search = { user_id : new ObjectId(req.query.user_id), status: 1, deleted_at : 0 }
		console.log(search);
		userProfileModel.aggregate([
			{
				$match : search
			},
			{
				$lookup:{
					from:"cities",
					localField:"city_id",
					foreignField:"_id",
					as:"city"
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"user_id",
					foreignField:"_id",
					as:"user"
				}
			},
			{
				$lookup:{
					from:"categories",
					localField:"category_id",
					foreignField:"_id",
					as:"category"
				}
			},
			{
				$lookup:{
					from:"categories",
					localField:"subcategory_id",
					foreignField:"_id",
					as:"subcategory"
				}
			},
			{
				$lookup:{
					from:"localities",
					localField:"locality_id",
					foreignField:"_id",
					as:"locality"
				}
			},		
			{
				$lookup:{
					from:"addressproofs",
					localField:"address_id",
					foreignField:"_id",
					as:"addressproofs"
				}
			},
			{
				$lookup:{
					from:"photoidproofs",
					localField:"photoproof_id",
					foreignField:"_id",
					as:"photoidproofs"
				
				}
			},
			{
				$lookup:{
					from:"languageknows",
					localField:"language_id",
					foreignField:"_id",
					as:"languages"
				}
			},
			{
				$project:{
					address:1,
					resume_title:1,
					resume_name:1,
					current_salary:1,
					company_name:1,
					experience:1,
					notice_period:1,
					designation:1,
					skill_name:1,
					education:1,
					year_of_passing:1,
					date_of_joining : 1,
					passport:1,
					diploma: 1,
					name_of_course : 1,
					user:1,
					subcategory:1,
					"city._id":1,
					"city.name":1,
					"category._id":1,				
					"category.name":1,
					"category.description":1,
					"locality._id":1,
					"locality.name":1,
					"addressproofs._id":1,
					"addressproofs.name":1,
					"photoidproofs._id":1,
					"photoidproofs.name":1,
					"languages._id":1,
					"languages.name":1,
					employment_status:1
	
	
				}
			}
		], function(error, record){
			if(record){
				return res.send({ status : HttpStatus.OK, code : 0, data : record, message : "", resume_path : constant.SHOW_USER_RESUME});
			}else{
				return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : ""});
			}
		});
	}catch(err){
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}	
}

async function candidateSearch(req, res){	
	console.log(req.query);
	const skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
	const limit = req.query.limit ? parseInt(req.query.limit): 10;
	let search = { deleted_at : 0, status : 1 }
	
/*	if(req.query.name){
		search.company_name = { '$regex' : req.query.name };
	}*/

	if(req.query.skill_name){
		const data = req.query.skill_name;
		const job_id = data.split(',');
		var skillname = []
		for(let i=0;i<job_id.length;i++){
			skillname.push(job_id[i]);
		}
		search.skill_name = { $in : skillname }
	}

	if(req.query.user_id){
		search.user_id = { $ne : new ObjectId(req.query.user_id) }
	}

	if(req.query.city_id){
		search.city_id =  new ObjectId(req.query.city_id)
	}
	if(req.query.category_id){
		search.category_id =  new ObjectId(req.query.category_id)
	}
	if(req.query.subcategory_id){
		search.subcategory_id = { $in : req.query.subcategory_id }
	}
	if(req.query.locality){
		search.locality_id = new ObjectId(req.query.locality)
	}

	if(req.query.exp_min && req.query.exp_max){
		search.experience = { $gte : parseInt(req.query.exp_min), $lte : parseInt(req.query.exp_max)}
	}
/*	if(req.query.salary_min && req.query.salary_max){
		search.current_salary = { $gte : parseInt(req.query.salary_min), $lte : parseInt(req.query.salary_max)}
	}*/
	if(req.query.jobtype){
		const data = req.query.jobtype;
		const job_id = data.split(',');
		var employment = []
		for(let i=0;i<job_id.length;i++){
			employment.push(job_id[i]);
		}
		search.employment_status = { $in : employment }
	}
	let sort_by = { 'created_at' : -1 };
	if(req.query.sort == 'oldest'){
		sort_by = { 'created_at' : 1 };
	}
	console.log(search);
	const total_record = await userProfileModel.find(search);
	//const detail = await userProfileModel.find(search).populate('city_id user_id locality_id category_id skill_id language_id address_id photoproof_id','city_id.name');
	userProfileModel.aggregate([
		{
			$match : search
		},
		{
			$sort : sort_by
		},
		{
			$lookup:{
				from:"cities",
				localField:"city_id",
				foreignField:"_id",
				as:"city"
			}
		},
		{
			$lookup:{
				from:"users",
				localField:"user_id",
				foreignField:"_id",
				as:"user"
			}
		},
		{
			$lookup:{
				from:"categories",
				localField:"category_id",
				foreignField:"_id",
				as:"category"
			}
		},
		{
			$lookup:{
				from:"localities",
				localField:"locality_id",
				foreignField:"_id",
				as:"locality"
			}
		},		
		{
			$lookup:{
				from:"addressproofs",
				localField:"address_id",
				foreignField:"_id",
				as:"addressproofs"
			}
		},
		{
			$lookup:{
				from:"photoidproofs",
				localField:"photoproof_id",
				foreignField:"_id",
				as:"photoidproofs"
			
			}
		},
		{
			$lookup:{
				from:"languageknows",
				localField:"language_id",
				foreignField:"_id",
				as:"languages"
			}
		},
		{
			$project:{
				address:1,
				resume_title:1,
				resume_name:1,
				current_salary:1,
				company_name:1,
				experience:1,
				notice_period:1,
				designation:1,
				education:1,
				year_of_passing:1,
				passport:1,
				diploma: 1,
				name_of_course : 1,
				user:1,
				"city._id":1,
				"city.name":1,
				"category._id":1,				
				"category.name":1,
				"category.description":1,
				"locality._id":1,
				"locality.name":1,
				"addressproofs._id":1,
				"addressproofs.name":1,
				"photoidproofs._id":1,
				"photoidproofs.name":1,
				"languages._id":1,
				"languages.name":1,
				employment_status:1,
				skill_name : 1


			}
		},
		{ 
			$skip : skip 
		},
		{ 
			$limit : limit 
		}
	], function(error, record){
		if(record && record.length >0){
			async.eachSeries(record, (item,callback)=>{
				const sort_data = sortlisted_candidateModel.findOne({user_id : new ObjectId(req.query.user_id), profile_id : item._id, status : true, deleted_at : 0})
				if(sort_data){
					item.selected = 1;
					callback();	
				}else{
					item.selected = 0;
					callback();	
				}
						
			},(err)=>{			
				return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record, total_record : total_record.length });
			})			
		}else{
			return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record, total_record : total_record.length });
		}
	});	
}


async function generateOtp(req,res){
	try{
		const params = req.body;
		const otp = Math.floor(1000 + Math.random() * 9000);
		params.otp =otp;		
		params.message = "Your Otp: "+otp;
		
		if(params.purpose == 'register'){
			const userdata = await userModel.findOne({ mobile : parseInt(params.mobile), status : 1, deleted_at : 0})
			if(userdata){
				return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("This number is already in used, please use another number")});
			}
		}
		if(params.purpose == 'forgot'){
			const userdata = await userModel.findOne({ mobile : parseInt(params.mobile), status : 1, deleted_at : 0})
			if(!userdata){
				return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("This number is not register, please enter register number")});
			}
		}
		const detail = await commanHelper.generateOtp(params);
		if(!detail){
			return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : "Otp has been sent successfully"});
		}else{
			return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : ""});
		}
	}catch(err){
		console.log(err)
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}
}

async function verifyOtp(req,res){
	try{
		const params = req.body;
		const detail = await commanHelper.verifyOtp(params);
		if(detail.success){
			return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : detail.message});

		}else{
			return res.send({ status : HttpStatus.FORBIDDEN, code : 0, data : {}, message : detail.message});

		}
	}catch(err){
		console.log(err)
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}
}

async function changepassword(req,res){
	try{
		console.log(req.body);
		const data = await userModel.findOne({ mobile : parseInt(req.body.mobile), status : 1, deleted_at : 0});
		if(data){
			const detail = await userService.changePassword(req.body);
			if(detail){
				return res.send({ status : HttpStatus.OK, code : 0, data : {}, message :req.__("Your password change successfully")});

			}else{
				return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Something went wrong")});
			}
		}else{
			return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("User not register")});
		}
	}catch(err){
		console.log(err)
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
	}	
}

async function childUsers(req, res){	
	console.log(req.query);
	const skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
	const limit = req.query.limit ? parseInt(req.query.limit): 10;
	let search = { deleted_at : 0, status : 1 }
	if(req.query.user_id){
		search.parent_id = new ObjectId(req.query.user_id)
	}	
	let sort_by = { 'createdAt' : -1};
	console.log(search)	
	const total_record = await userModel.find(search);
	userModel.aggregate([
		{
			$match : search
		},
		{
			$sort : sort_by
		},
		{
			$lookup:{
				from:"users",
				localField:"parent_id",
				foreignField:"_id",
				as:"parent_data"
			}
		},
		{
			$unwind : "$parent_data"
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

async function candiatesortlisted(req, res){
	console.log(req.query);
	const job = await sortlisted_candidateModel.findOne({ profile_id : new ObjectId(req.query.profile_id), user_id : new ObjectId(req.query.user_id), status : true, deleted_at : 0});
	const sort_profile = {
		user_id : req.query.user_id,
		profile_id : req.query.profile_id,
		profile_user_id : req.query.profile_user_id
	}
	if(!job){
		const jobData = await userService.selectcandidate(req, sort_profile)
		if(jobData){
			return res.send({ status : HttpStatus.OK, code : 0, message : req.__('Candidate has beeb sortlisted successfully'), data : {} })
		}else{		
			return res.send({ status : HttpStatus.OK, code : 0, message : req.__("Something went wrong"), data : {} });
		}
	}else{		
		return res.send({ status : HttpStatus.OK, code : 0, message : req.__("Candidate already sortlisted"), data : {} });
	}
}

async function sortlisted_candidate_list(req, res){
	const skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
	const limit = req.query.limit ? parseInt(req.query.limit): 10;
	const total_record = await sortlisted_candidateModel.find({ user_id : new ObjectId(req.query.user_id), deleted_at : 0, status : true });
	sortlisted_candidateModel.aggregate([
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
				from : "users",
				localField : "user_id",
				foreignField : '_id',
				as : "user_data"
			}
		},
		{
			$lookup :
			{
				from : "userprofiles",
				localField : "profile_id",
				foreignField : '_id',
				as : "profile_data"
			}
		},
		
		{
			$unwind : "$profile_data"
		},
		{
			$lookup :
			{
				from : "cities",
				localField : "profile_data.city_id",
				foreignField : '_id',
				as : "profile_data.city_detail"
			}
		},
		{
			$lookup :
			{
				from : "localities",
				localField : "profile_data.locality_id",
				foreignField : '_id',
				as : "profile_data.locality_detail"
			}
		}
		/*,
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
		}*/
	], function(error, record){
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record, total_record : total_record.length});
	});	
}

module.exports = {
	login,
	registration,
	updateprofile,
	applyjob,
	getProfile,
	candidateSearch,
	candiatesortlisted,
	generateOtp,
	verifyOtp,
	changepassword,
	childUsers,
	sortlisted_candidate_list
}
