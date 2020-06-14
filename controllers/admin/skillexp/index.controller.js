var model  = require('../../../models/index.model');
var config = require('../../../config/index');
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const constants = require(`${appRoot}/config/constant`);
var db 	   = config.connection;
var async = require("async");
var bcrypt = require("bcrypt-nodejs");
const csvMosule = require('csvtojson');

var Admin = model.admin;
console.log(model);
var permission = {add:1,edit:1,delete:1}
module.exports = {
	index:async function(req,res){
		if(req.method =="POST"){
			const csv = await commanHelper.uploadFile(req.files,'file',constants.UPLOAD_SKILL_EXP);
			const csvData = await csvMosule().fromFile(constants.UPLOAD_SKILL_EXP+csv);
			for(let i =0;i<csvData.length;i++){
				let code = csvData[i].type;
				if(parseInt(csvData[i].type) ==1){
					code = "SKILL"
				}
				checkData = await model.skill_library.find({deleted_at:0,name:csvData[i].name, code:code}).sort({_id:"DESC"});
				if(checkData && checkData.length){

				}else{
					model.skill_library.create({deleted_at:0,name:csvData[i].name, code:code, status:true})
				}
			}
			req.flash('message', req.__('Data has been successfully'));
			res.redirect('/admin/user')
		}else{		
			  config.helpers.search_url.administrator(req, async function(data_search){			
				const detail =  await model.skill_library.find({deleted_at:0}).sort({_id:-1});
				res.render('admin/skillexp/view.ejs',{layout:'admin/layout/layout', detail:detail} );
			})	
		}
	},	
}