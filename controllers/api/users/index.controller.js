const userService = require(`${appRoot}/services/admin/user`);
const userModel  = require(`${appRoot}/models/user.model`);
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
		const record = await userModel.findOne({ mobile : parseInt(req.body.mobile)});
		console.log(record);
		if(record){
			if(bcrypt.compareSync(req.body.password, record.password)){
				const token = await utils.generate_token(record);
				return res.send({status:HttpStatus.OK, code : 0, data:record, message:"", token:token});
			}else{
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
	const record = await userModel.findOne({ mobile : parseInt(req.body.mobile)});
	if(record){
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, message : req.__("Mobile number already in used, please choose another number"), data : {}});
	}else{
		try{
			req.body.createdby = 'mobile';
			req.body.photo = '';
			req.body.image = '';
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
	const record = await userModel.findOne({ _id : { $ne : new ObjectId(req.body.id)}, mobile : parseInt(req.body.mobile)});
	if(record){
		return res.send({ status : HttpStatus.FORBIDDEN, code : 1, message : req.__("Mobile number already in used, please choose another number"), data : {}});
	}else{
		try{
			req.body.photo = '';
			const userData = await userService.edit(req.body.id, req);
			if(userData){
				return res.send({ status : HttpStatus.OK, code : 0, data : {}, message : req.__("Profile has beeb updated successfully")});
			}
		}catch(err){
			return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : req.__("Something went wrong")});
		}	
	}				
}

module.exports = {
	login,
	registration,
	updateprofile
}
