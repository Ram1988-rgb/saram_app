'use strict';

const jobModel = require(`${appRoot}/models/job.model`);
const applyjobModel  = require(`${appRoot}/models/applyjob.model`);
const commanHelper  = require(`${appRoot}/helpers/comman.helper`);
const ObjectId = require('mongodb').ObjectId;

async function addJob(param){
	console.log(param);
	var data = param.subcategory;
	let subcategory_id = [];
	if(typeof data == 'string'){
		 subcategory_id = data.split(',');
	}
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
		category_id : param.category,
		subcategory_id : subcategory_id,
		name : param.name,
		keyword : param.keyword ? param.keyword : '', 
		company : company,
		company_data : company_data,
		jobtype : param.jobtype,
		salary_min : param.salary_min ? parseInt(param.salary_min) : 0,
		salary_max : param.salary_max ? parseInt(param.salary_max) : 0,
		exp_min : param.exp_min ? parseInt(param.exp_min) : 0,
		exp_max : param.exp_max ? parseInt(param.exp_max) : 0 ,
		city_id : new ObjectId(param.city_id),
		user_id : new ObjectId(param.user_id),
		locality_id : param.locality_id ? new ObjectId(param.locality_id) : null,
		description : param.description ? param.description.trim() : '',
		start_time : new Date(),
		end_time : new Date(),
		createdby : param.user_id
	})
	const newData =  await newJob.save();
	if(newData && newData._id) {
		await commanHelper.abusiveJobSearch(newData._id);
	}
	return newData;
}

async function editJob(id, param){
	var data = param.subcategory;
	let subcategory_id = data;
	if(typeof data == 'string'){
		 subcategory_id = data.split(',');
	}
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
		category_id : param.category,
		subcategory_id : subcategory_id,
		name : param.name,
		keyword : param.keyword ? param.keyword : '', 
		company : company,
		company_data : company_data,
		jobtype : param.jobtype,
		salary_min : param.salary_min ? parseInt(param.salary_min) : 0,
		salary_max : param.salary_max ? parseInt(param.salary_max) : 0,
		exp_min : param.exp_min ? parseInt(param.exp_min) : 0,
		exp_max : param.exp_max ? parseInt(param.exp_max) : 0 ,
		city_id : new ObjectId(param.city_id),
		user_id : new ObjectId(param.user_id),
		locality_id : param.locality_id ? new ObjectId(param.locality_id) : null,
		description : param.description ?  param.description.trim() : ''
	};
	const updData = await jobModel.updateOne({ _id : id }, updateJob);
	await commanHelper.abusiveJobSearch(id);
	return updData;
}

async function applyjob(req, data){
	let job_data = await jobModel.findOne({ _id : req.query.job_id });
	if(job_data){
		const user_data = job_data.apply_users;
		user_data.push(req.query.user_id);
		await jobModel.updateOne({_id : job_data._id }, { apply_users : user_data });
	}
	return await applyjobModel.create(data);
}

module.exports ={
  addJob,
  editJob,
  applyjob
}
