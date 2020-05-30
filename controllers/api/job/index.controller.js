const model  = require('../../../models/index.model');
const constant = require('../../../config/constant');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
module.exports = {
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
		
	}
		
}
