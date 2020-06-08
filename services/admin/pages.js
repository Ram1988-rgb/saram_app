'use strict';

const staticpagesModel = require(`${appRoot}/models/staticpages.model`);
const ObjectId = require('mongodb').ObjectId;

async function addPages(param){
	const newPages = new staticpagesModel({
		title : param.title,
		meta_title : param.meta_title,
		description : param.description,
		status:true,
		deleted_at:0
	})
	return await newPages.save(); 
}

async function editPages(id, param){
	const updatePages = {
		title : param.title,
		meta_title : param.meta_title,
		description : param.description
	};
	return staticpagesModel.updateOne({ _id : id }, updatePages);
}

module.exports ={
	addPages,
  	editPages
}
