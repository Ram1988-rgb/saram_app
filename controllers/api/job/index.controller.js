const jobModel  = require(`${appRoot}/models/job.model`);
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
const ObjectId = require('mongodb').ObjectId;

async function list(req, res){	
	const skip = parseInt(req.query.skip);
	const limit = parseInt(req.query.limit);
	let search = { deleted_at : 0, status : true }
	if(req.query.user_id){
		search.user_id = new ObjectId(req.query.user_id)
	}
	console.log(search)	
	jobModel.aggregate([
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
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
	});	
}

async function deatils(req, res){	
	console.log("test")
	jobModel.aggregate([
		{
			$match : 
			{
				_id : new ObjectId(req.query.id), deleted_at : 0, status : true
			}
		},
		{
			$lookup :
			{
				from : "users",
				localField : "user_id",
				foreignField : '_id',
				as : "user_data"
			}
		}
	], function(error, record){
		console.log(error);
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
	});	
}


module.exports = {		
	list,
	deatils
}
