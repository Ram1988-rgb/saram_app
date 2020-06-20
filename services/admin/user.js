'use strict';

const ObjectId = require('mongodb').ObjectId;
const async = require("async");
const bcrypt = require("bcrypt-nodejs");
const userModel = require(`${appRoot}/models/user.model`);
const profileModel = require(`${appRoot}/models/userProfile.model`);


async function getProfile(id){
    return await userModel.findOne({_id:id});
}
async function getProfileData(id){	
	return await profileModel.findOne({user_id:ObjectId(id)});
}

async function add(req){
	var newUser = new userModel({
		name	: req.body.name,
		email	: req.body.email ? req.body.email : '',
		mobile	: parseInt(req.body.mobile),
		dob		: req.body.dob ? req.body.dob : '',
		gender		: req.body.gender ? req.body.gender : '',
		seeker	: 0,
		provider	: 1,
		password	: bcrypt.hashSync(req.body.pass),
		parent_id : req.body.user_id ? new ObjectId(req.body.user_id) : null,
		createdby	: req.body.createdby,
		photo_type_id : req.body.photo_id_type ? new ObjectId(req.body.photo_id_type): null,
		photo_id_number : req.body.photo_id_number ? req.body.photo_id_number : '',
		photo_proof : req.body.photoId ? req.body.photoId : '',
		image : req.body.image
	});
	const userData = await newUser.save();
	
	const profile = await profileModel.findOne(userData._id);
	
	if(!profile){
		const newProfile = new profileModel({
			user_id :(userData._id)
		});
		
		newProfile.save();
	}

	return userData;
 
}

async function edit(id, req){
	var updateUser = {
		name	: req.body.name,
		email	: req.body.email,
		dob		: req.body.dob ? req.body.dob : '',
		gender		: req.body.gender ? req.body.gender : '',
		mobile	: parseInt(req.body.mobile),
		photo_type_id : new ObjectId(req.body.photo_id_type),
		photo_id_number : req.body.photo_id_number
	}
	if(req.body.pass){
	  updateUser.password=bcrypt.hashSync(req.body.pass)  
	}
	if(req.body.photoId){
	  updateUser.photo_proof = req.body.photoId 
	}
	if(req.body.image){
	  updateUser.image = req.body.image 
	}
	return userModel.updateOne({ _id : id }, updateUser);
}

async function addUserProfile(req){
	console.log(req.body);
	var data = req.body.subcategory;
	let subcategory_id = data;
	if(typeof data == "string"){
		 subcategory_id = data.split(',');
	}
	const detail = {
		city_id 	: new ObjectId(req.body.city),
		user_id 	: req.params.id,
		locality_id : req.body.locality ? req.body.locality : null,
		category_id : req.body.category,
		subcategory_id : subcategory_id,
		employment_status : req.body.jobtype ? req.body.jobtype: [],
		//skill_id 	: req.body.skills,
		address	: req.body.address ? req.body.address : '',
		notice_period : req.body.notice_period ? req.body.notice_period : '',
		//designation_id : req.body.designation,
		designation : req.body.designation ? req.body.designation : '',
		date_of_joining	: req.body.date_of_joining ? req.body.date_of_joining : '',
		education : req.body.education ? req.body.education : '',
		name_of_course : req.body.name_of_course ? req.body.name_of_course : '',
		year_of_passing : req.body.year_of_passing ? req.body.year_of_passing : '',
		language_id : req.body.language ? req.body.language : [],
		address_id 	: req.body.adProof ? req.body.adProof : [],
		photoproof_id : req.body.pIdProof ? req.body.pIdProof : [],		
		resume_title 	: req.body.resume_title,
		current_salary : req.body.salary ? parseInt(req.body.salary) : 0,
		company_name :req.body.company,
		experience 	: req.body.year_of_exp ? parseInt(req.body.year_of_exp): 0,
		passport 	: (req.body.passport && req.body.passport == 'Yes') ? true : false,
		diploma 	: (req.body.diploma && req.body.diploma == 'yes')? true : false,   
		skill_name  : req.body.skills?req.body.skills:[]
	}
	if(req.body.resume_name){
		detail.resume_name 	= req.body.resume_name
	}
	
	return await profileModel.updateOne({user_id:req.params.id},detail); 
}

async function updateProfile(id, update_data){	
	return profileModel.updateOne({ _id : id }, update_data);
}

async function createProfile(update_data){
	var newUserProfile = new profileModel(update_data);
	return await newUserProfile.save();
}

async function generateOtp(params){
	

}

module.exports = {
    getProfile,
    add,
	edit,
	addUserProfile,
	updateProfile,
	createProfile,
	getProfileData
}
