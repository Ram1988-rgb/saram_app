'use strict';

const jobModel = require(`${appRoot}/models/job.model`);

async function addJob(param){
	var data = param.data;
	const category_id = data.split(',');
	const newJob = new jobModel({
		category_id : category_id,
		name : param.name,
		jobtype : param.jobtype,
		salary_min : param.salary_min,
		salary_max : param.salary_max,
		exp_min : param.exp_min,
		exp_max : param.exp_max,
		city_id : param.city_id,
		locality_id : param.locality_id,
		description : param.description,
		start_time : new Date(),
		end_time : new Date(),
		createdby : param.user_id,
		status:true,
		deleted_at:0
	})
	return await newJob.save(); 
}

async function editJob(id, param){
	var data = param.data;
	const category_id = data.split(',');
	const updateJob = {
		category_id : category_id,
		name : param.name,
		jobtype : param.jobtype,
		salary_min : param.salary_min,
		salary_max : param.salary_max,
		exp_min : param.exp_min,
		exp_max : param.exp_max,
		city_id : param.city_id,
		locality_id : param.locality_id,
		description : param.description
	};
	return jobModel.updateOne({ _id : id }, updateJob);
}

module.exports ={
  addJob,
  editJob
}
