const ratingService = require(`${appRoot}/services/rating`);
const userModel  = require(`${appRoot}/models/user.model`);
const jobratingModel  = require(`${appRoot}/models/jobrating.model`);
const profileratingModel  = require(`${appRoot}/models/profilerating.model`);
const {constants} = require(`${appRoot}/config/string`);
const HttpStatus = require('http-status');
const ObjectId = require('mongodb').ObjectId;

async function jobrating (req, res){
	try{		
		let data = {
			user_id : req.body.user_id,
			job_id : req.body.job_id,
			rating : req.body.rating ? parseInt(req.body.rating) : 0,
			comment : req.body.comment ? req.body.comment : ''
		};
		const record = await jobratingModel.create(data);
		if(record){		
				return res.send({ status : HttpStatus.OK, code : 0, data : [], message : req.__("Job rating successfully")});
		}else{
			return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : constants.SOMETHING_WENT_WRONG });
		}
	}catch(err){
		return res.json({ status : false, code : 1, message : constants.SOMETHING_WENT_WRONG });
	}              
}

async function candidaterating (req, res){
	console.log(req.body);
	try{		
		let data = {
			user_id : req.body.user_id,
			profile_id : req.body.profile_id,
			profile_user_id : req.body.profile_user_id,
			rating : req.body.rating ? parseInt(req.body.rating) : 0,
			comment : req.body.comment ? req.body.comment : ''
		};
		let updatedata = {
			rating : req.body.rating ? parseInt(req.body.rating) : 0,
			comment : req.body.comment ? req.body.comment : ''
		};
		const record = await profileratingModel.findOne({ user_id : new ObjectId(req.body.user_id), profile_id : new ObjectId(req.body.profile_id), deleted_at : 0, status : 1 })
		if(record){
			 await profileratingModel.updateOne({_id : record._id},updatedata);
			const insert_data = await ratingService.createRating(data);
			if(insert_data){
				const update_user_rating = await ratingService.updateRating(req.body);	
				if(update_user_rating){
					const rating = update_user_rating[0].avg_rating
					await userModel.updateOne({ _id : new ObjectId(req.body.profile_user_id)},{ rating : Math.floor(rating)});
					return res.send({ status : HttpStatus.OK, code : 0, data : [], message : req.__("Profile rating successfully")});
				}else{
					return res.send({ status : HttpStatus.OK, code : 0, data : [], message : req.__("Profile rating successfully")});
				}	
			}else{
				return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : constants.SOMETHING_WENT_WRONG });
			}
		}else{
			await profileratingModel.create(data);
			const insert_data = await ratingService.createRating(data);
			if(insert_data){	
				const update_user_rating = await ratingService.updateRating(req.body);	
				if(update_user_rating){
					const rating = update_user_rating[0].avg_rating
					await userModel.updateOne({ _id : new ObjectId(req.body.profile_user_id)},{ rating : Math.floor(rating)});
					return res.send({ status : HttpStatus.OK, code : 0, data : [], message : req.__("Profile rating successfully")});
				}else{
					return res.send({ status : HttpStatus.OK, code : 0, data : [], message : req.__("Profile rating successfully")});
				}			
			}else{
				return res.send({ status : HttpStatus.FORBIDDEN, code : 1, data : {}, message : constants.SOMETHING_WENT_WRONG });
			}
		}
	}catch(err){
		return res.json({ status : false, code : 1, message : constants.SOMETHING_WENT_WRONG });
	}              
}

async function rating_list(req, res){
	console.log(req.query);
	const skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
	const limit = req.query.limit ? parseInt(req.query.limit): 10;
	const total_record = await profileratingModel.count({ profile_user_id : new ObjectId(req.query.user_id), deleted_at : 0, status : 1 });
	let sort_by = { 'createdAt' : -1};
	profileratingModel.aggregate([
		{
			$match : 
			{
				profile_user_id : new ObjectId(req.query.user_id), deleted_at : 0, status : 1
			}
		},
		{
			$sort : sort_by
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
				localField : "profile_user_id",
				foreignField : '_id',
				as : "profile_user_data"
			}
		},
		{
			$unwind : "$profile_user_data" 
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
			$unwind : "$user_data" 
		}
	], function(error, record){		
		return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record, total_record : total_record});
	});	
}


module.exports = {
	jobrating,
	candidaterating,
	rating_list
}
