'use strict';

const ObjectId = require('mongodb').ObjectId;
const async = require("async");
const bcrypt = require("bcrypt-nodejs");
const userModel = require(`${appRoot}/models/user.model`);
const profileModel = require(`${appRoot}/models/userProfile.model`);

async function getProfile(id){
    return await userModel.findOne({_id:id});
}

async function add(req){
	var newUser = new userModel({
		name	: req.body.name,
		email	: req.body.email,
		mobile	: parseInt(req.body.mobile),
		seeker	: 0,
		provider	: 1,
		password	: bcrypt.hashSync(req.body.pass),
		createdby	: req.body.createdby,
		photo_type_id : new ObjectId(req.body.photo_id_type),
		photo_id_number : req.body.photo_id_number,
		photo_proof : req.body.photoId,
		image : req.body.image,			
		status	: true,
		deleted_at	:  0
	});
	return await newUser.save(); 
}

async function edit(id, req){
	var updateUser = {
		name	: req.body.name,
		email	: req.body.email,
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
	const data = req.body.data;
	console.log(data);
	const category_id = data.split(',');
	var newUserProfile = new profileModel({
		city_id 	: new ObjectId(req.body.city),
		user_id 	: req.params.id,
		locality_id : req.body.locality,
		category_id : category_id,
		skill_id 	: req.body.skills,
		designation_id : req.body.designation,
		language_id : req.body.language,
		address_id 	: req.body.adProof,
		photoproof_id : req.body.pIdProof,
		resume 		: req.body.resume,
		current_salary : parseInt(req.body.salary),
		company_name :req.body.company,
		experience 	: parseInt(req.body.year_of_exp),
		age 		: parseInt(req.body.age),
		gender 		: req.body.gender,
		passport 	: (req.body.passport && req.body.passport == 'yes') ? true : false,
		diploma 	: (req.body.diploma && req.body.diploma == 'yes'),   
		status 		: true,
		deleted_at	: 0
	});
	return await newUserProfile.save(); 
}

module.exports = {
    getProfile,
    add,
	edit,
	addUserProfile
}
