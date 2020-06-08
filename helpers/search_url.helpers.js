var model  = require('../models/index.model');
var config = require('../config/index');
module.exports = {
	administrator:function(req,cb){
		var query = "?search=1";
		if(req.params.pname){
			query = query+"&name="+req.params.pname;
		}
		if(req.params.pemail){
			query = query+"&email="+req.params.pemail;
		}
		if(req.params.user_name){
			query = query+"&username="+req.params.user_name;
		}
		if(req.params.prole){
			query = query+"&role="+req.params.prole;
		}
		if(req.params.pstatus){
			query = query+"&status="+req.params.pstatus;
		}
		
		if(query!="?search=1"){
			cb(query);
		}else{
			cb('');
		}
	},

	  job_list:async function(req,cb){
		var query = "?search=1";
		if(req.body.pname){
			query = query+"&name="+req.body.pname;
		}
		if(req.body.user_id){
			query = query+"&userId="+req.body.user_id;
		}
		if(req.body.pstatus){
			query = query+"&status="+req.body.pstatus;
		}
		
		if(query!="?search=1"){
			return query;
		}else{
			return '';
		}
	},

	apply_job : async function(req,cb){
		var query = "?search=1";		
		if(req.body.user_id){
			query = query+"&userId="+req.body.user_id;
		}
		if(req.body.pstatus){
			query = query+"&status="+req.body.pstatus;
		}
		
		if(query!="?search=1"){
			return query;
		}else{
			return '';
		}
	},

	static_list : async function(req,cb){
		var query = "?search=1";		
		if(req.body.pname){
			query = query+"&name="+req.body.pname;
		}
		if(req.body.pstatus){
			query = query+"&status="+req.body.pstatus;
		}
		
		if(query!="?search=1"){
			return query;
		}else{
			return '';
		}
	}
}
