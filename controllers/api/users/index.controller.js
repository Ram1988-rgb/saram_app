const userService = require(`${appRoot}/services/admin/user`);
const userModel  = require(`${appRoot}/models/user.model`);
const {constants} = require(`${appRoot}/config/string`);
const utils = require(`${appRoot}/middleware/utils`)
const bcrypt = require("bcrypt-nodejs");
const async = require("async");
const HttpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
//console.log(config)
module.exports = {
	login : async (req, res) => {
		try{
			var result = {};
			const record = await userModel.findOne({ mobile : parseInt(req.body.mobile)});
			console.log(record);
			if(record){
				if(bcrypt.compareSync(req.body.password, record.password)){
					const token = await utils.generate_token(record);
					return res.send({status:HttpStatus.OK, data:record, msg:"", token:token});
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
    }catch(err){
      return res.json({status:false, code:1, message:constants.SOMETHING_WENT_WRONG});
    }
	},
	
	registration : async (req, res) => {
		var result = {};
		const record = await userModel.findOne({ mobile : parseInt(req.body.mobile)});
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
		const record = await userModel.findOne({ _id : { $ne : new ObjectId(req.body.id)}, mobile : parseInt(req.body.mobile)});
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
