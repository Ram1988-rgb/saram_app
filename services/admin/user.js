'use strict';

const ObjectId = require('mongodb').ObjectId;
const async = require("async");
const bcrypt = require("bcrypt-nodejs");
const userModel = require(`${appRoot}/models/user.model`);

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
		photo_proof : req.body.photo,
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
	if(req.body.photo){
	  updateUser.photo_proof = req.body.photo 
	}
	if(req.body.image){
	  updateUser.image = req.body.image 
	}
	return userModel.updateOne({ _id : id }, updateUser);
}

module.exports = {
    getProfile,
    add,
    edit
}
