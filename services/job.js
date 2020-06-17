'use strict';

const jobModel = require(`${appRoot}/models/job.model`);
const ObjectId = require('mongodb').ObjectId;

async function addJob(param){
	console.log(param.user_id);
	var data = param.data;
	const category_id = data.split(',');
	let company = 'off';
	let company_data = [];
	if(param.company == 'on'){
		company = 'on';
		const comp_data = {
			name : param.company_name ? param.company_name : '',
			email : param.company_email ? param.company_email : '',
			phone : param.company_phone ? param.company_phone : ''
		};
		company_data.push(comp_data);
	}
	const newJob = new jobModel({
		category_id : category_id,
		name : param.name,
		keyword : param.keyword ? param.keyword : '', 
		company : company,
		company_data : company_data,
		jobtype : param.jobtype,
		salary_min : param.salary_min,
		salary_max : param.salary_max,
		exp_min : param.exp_min,
		exp_max : param.exp_max,
		city_id : new ObjectId(param.city_id),
		user_id : new ObjectId(param.user_id),
		locality_id : param.locality_id ? new ObjectId(param.locality_id) : null,
		description : param.description,
		start_time : new Date(),
		end_time : new Date(),
		createdby : param.user_id
	})
	return await newJob.save(); 
}

async function editJob(id, param){
	var data = param.data;
	const category_id = data.split(',');
	let company = 'off';
	let company_data = [];
	if(param.company == 'on'){
		company = 'on';
		const comp_data = {
			name : param.company_name ? param.company_name : '',
			email : param.company_email ? param.company_email : '',
			phone : param.company_phone ? param.company_phone : ''
		};
		company_data.push(comp_data);
	}
	const updateJob = {
		category_id : category_id,
		name : param.name,
		keyword : param.keyword ? param.keyword : '', 
		company : company,
		company_data : company_data,
		jobtype : param.jobtype,
		salary_min : param.salary_min,
		salary_max : param.salary_max,
		exp_min : param.exp_min,
		exp_max : param.exp_max,
		city_id : new ObjectId(param.city_id),
		user_id : new ObjectId(param.user_id),
		locality_id : param.locality_id ? new ObjectId(param.locality_id) : null,
		description : param.description
	};
	return jobModel.updateOne({ _id : id }, updateJob);
}

module.exports ={
  addJob,
  editJob
}
