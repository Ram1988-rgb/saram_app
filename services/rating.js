'use strict';

const userModel  = require(`${appRoot}/models/user.model`);
const profileratingModel  = require(`${appRoot}/models/profilerating.model`);
const profilerating_historyModel  = require(`${appRoot}/models/profilerating_history.model`);
const ObjectId = require('mongodb').ObjectId;

async function createRating(data){	
	return await profilerating_historyModel.create(data);
}
async function updateRating(params){
	return profileratingModel.aggregate([
		{
			$match : 
			{
				profile_id : new ObjectId(params.profile_id)
			}
		},
		{
			$group :
			{
				_id : null,
				avg_rating : { $avg : "$rating"}
			}
		}
	]);
}
module.exports ={
	createRating,
	updateRating
}
