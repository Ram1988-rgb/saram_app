const jobModel  = require(`${appRoot}/models/job.model`);
const categoryModel  = require(`${appRoot}/models/category.model`);
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const HttpStatus = require('http-status');
const ObjectId = require('mongodb').ObjectId;

async function category(req, res){
	//record.category = await commanHelper.getCategory();	
	categoryModel.find({status :true, deleted_at:0 }).sort({'level':'ASC'}).exec(function(err, data){
		jsonData = JSON.parse(JSON.stringify(data));
		//category list
		var arr = [];
		for (var i = 0; i < jsonData.length; i++) {
				data[i].category = [];
			}
		   for (var i = 0; i < jsonData.length; i++) {
			  for (var j = 0; j < jsonData.length; j++) {
				 if (i != j) {
					var catJsonId = jsonData[i].cat_id?(jsonData[i].cat_id).toString():jsonData[i].cat_id;
					if (catJsonId  == jsonData[j]._id) {
						arr.push(i);
					   
					   if (jsonData[j].category) {							
						  jsonData[j].category.push(jsonData[i]);
					   } else {							
						  jsonData[j].category = [];
						  jsonData[j].category.push(jsonData[i]);
					   }
					}

				 }
			  }
		   }			  
		   if (arr.length) {
			  var res_data = [];
			  for (var i = 0; i < jsonData.length; i++) {
				 if (arr.indexOf(i) == -1) {
					res_data.push(jsonData[i]);
				 }
			  }
			  jsonData = res_data;

		   }
		   return res.send({ status : HttpStatus.OK, code : 0, message : '', data : jsonData });
		   //res.send(jsonData);
		});
	
}

async function country_data(req, res){
	let record = {};
	record.country = await commanHelper.getCountry();
	record.city = await commanHelper.getCity();	
	record.locality = await commanHelper.getlocalityList();
	return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
}

async function miscellaneous(req, res){
	let record = {};
	record.language = await commanHelper.langKnown();
	record.proof = await commanHelper.addressProof();
	record.jobTypes = await commanHelper.jobType();
	record.photIdProof = await commanHelper.photoIdProof();
	record.skillTypes = await commanHelper.skillTypes();
	record.skillLibrary = await commanHelper.skillLibrary();
	return res.send({ status : HttpStatus.OK, code : 0, message : '', data : record });
}

module.exports = {		
	category,
	country_data,
	miscellaneous
}
