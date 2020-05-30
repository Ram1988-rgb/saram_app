const model  = require('../../../models/index.model');
const constant = require('../../../config/constant');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
module.exports = {
<<<<<<< HEAD
	list : async (req, res) =>{
		var result = {};
		model.job.aggregate([
			{
				$match :
				{
					deleted_at : 0,
					status : true
				}
			},
			{
				$lookup : 
				{
					from : "users",
					localField : "_id",
					foreignField : "user_id",
					as : "user_data"
				}
			}
		],function(error, record){
			result.status = HttpStatus.OK;
			result.data = record;
			res.send(result);
		});
	},
	
	apply : async (req, res) => {
		var result = {};
		
=======
	list : async (req, res) =>{		
		const resut_data = await model.job.find({ status : true, deleted_at : 0})
		const result = {};		
		const status = HttpStatus.OK;
		result.data = resut_data;
		result.status = status;
		res.status(status).send(result);
>>>>>>> d4a69d4ca3f3461d3d64c59a5f8e83102363531a
	}
		
}
