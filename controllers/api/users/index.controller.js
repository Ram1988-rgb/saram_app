const userService = require(`${appRoot}/services/admin/user`);
const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const constant = require('../../../config/constant');
const bcrypt = require("bcrypt-nodejs");
const async = require("async");
const HttpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
module.exports = {
	generate_token : (req, res) =>{
		const result = {};
		const payload = { user : "sram app", exp : Math.floor(Date.now() / 1000) + (60 * 60 * 24)};               
		const secret = constant.JWT_SECRET;
		const token = jwt.sign(payload, secret);
		const status = 200;
		result.token = token;
		result.status = status;
		res.status(status).send(result);
	},
	
	login : async (req, res) => {
		var result = {};
		const record = await model.user.findOne({ mobile : parseInt(req.query.mobile)});
		console.log(record);
		if(record){
			if(bcrypt.compareSync(req.query.password, record.password)){
				result.status = HttpStatus.OK
				result.data = record;
				result.msg = "";
				res.send(result)
			}else{
				result.status = HttpStatus.FORBIDDEN;
				result.data = {};
				result.msg = req.__("Password does not match");
				res.send(result);
			}
		}else{
			result.status = HttpStatus.FORBIDDEN;
			result.data = {};
			result.msg = req.__("Mobile number not exists")
			res.send(result);
		}
	},
	
	registration : async (req, res) => {
		var result = {};
		const record = await model.user.findOne({ mobile : parseInt(req.body.mobile)});
		if(record){
			result.status = HttpStatus.FORBIDDEN;
			result.data = {};
			result.msg = req.__("Mobile number already in used, please choose another number");
			res.send(result);
		}else{
			try{
				req.body.createdby = 'mobile';
				req.body.photo = '';
				req.body.image = '';
				const userData = await userService.add(req);
				if(userData){
					result.status = HttpStatus.OK
					result.data = userData;
					result.msg = req.__("Profile has beeb created successfully");
					res.send(result);
				}
			}catch(err){
				result.status = HttpStatus.FORBIDDEN;
				result.data = {};
				result.msg = req.__("Something went wrong")
				res.send(result);
			}
		}		
	},
	
	updateprofile : async (req, res) => {
		var result = {};
		const record = await model.user.findOne({ _id : { $ne : new ObjectId(req.body.id)}, mobile : parseInt(req.body.mobile)});
		if(record){
			result.status = HttpStatus.FORBIDDEN;
			result.data = {};
			result.msg = req.__("Mobile number already in used, please choose another number");
			res.send(result);
		}else{
			try{
				req.body.photo = '';
				const userData = await userService.edit(req.body.id, req);
				if(userData){
					result.status = HttpStatus.OK;
					result.data = {};
					result.msg = req.__("Profile has beeb updated successfully");
					res.send(result);
				}
			}catch(err){
				result.status = HttpStatus.FORBIDDEN;
				result.data = {};
				result.msg = req.__("Something went wrong")
				res.send(result);
			}	
		}				
	}
	
}
