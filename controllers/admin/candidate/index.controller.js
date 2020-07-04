var model  = require('../../../models/index.model');
var config = require('../../../config/index');
var async = require("async");
var bcrypt = require("bcrypt-nodejs");
var mongoose = require('mongoose');
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const jobService = require(`${appRoot}/services/job.js`);
const ObjectId = require('mongodb').ObjectId;
var self= module.exports  = {
	index: async (req,res)=>{
		const data_search = await config.helpers.search_url.apply_job(req);		
		if(data_search!=""){
			return res.redirect(config.constant.ADMINSITEURL+"candidate"+data_search);
		  }
		var users = await commanHelper.getUers();
		config.helpers.permission('candidate', req, (err,permission)=>{
			res.render('admin/user/candidate.ejs',{layout:'admin/layout/layout',permission:permission, users : users} );
		});
	},
        all:(req,res)=>{
		var search = {deleted_at:0}		
		if(req.body.user_id){
			search.user_id = mongoose.Types.ObjectId(req.body.user_id);
		}
		if(req.body.status){
			search.status = parseInt(req.body.status)?true:false;
		}
		var seq = req.input('order')?req.input('order'):[{}]
		//sorting
		var sort_json = {0:"createdAt",1:"name"};
		var col = sort_json[seq[0]['column']];
		var dir = seq[0]['dir'];
		if(req.input('order')[0]['column']==0){
	      dir = 'DESC';
	    }	
	    var skip = req.input('start')?parseInt(req.input('start')):0;
		var limit=req.input('length')?parseInt(req.input('length')):10;
                
                     var countData = new Promise((resolve, reject) => {
                          var count=model.sortlisted_candidate.countDocuments(search);
                          resolve(count);
                      });
                      var fetchData = new Promise((resolve, reject) => {
                          var data=model.sortlisted_candidate.find(search).skip(skip).limit(limit).sort({createdAt: dir});
                          resolve(data);
                      });
                  Promise.all([countData,fetchData])
                     .then((results)=> {
                       var obj = {
				draw:req.input('draw'),
				recordsTotal:results[0],
				recordsFiltered:results[0],
				//data:await self.alldata(results)
			};
			config.helpers.permission('candidate', req, (err,perdata)=>{
				self.datatable(skip,perdata,results[1],(detail)=>{
					obj.data = detail;
					res.send(obj);
				})
			})
                 })
                 .catch(error => console.log(`Error in executing ${error}`))
		
	},
        datatable:(skip,perdata,alldata,cb)=>{		
			var arr =[];
			var i = parseInt(skip)+1;
			if(alldata.length>0){
					async.eachSeries(alldata, (item,callback)=>{
						console.log(item);
						model.user.findOne({ _id :item.user_id }).exec(function(error, userDetail){
							model.user.findOne({ _id :item.profile_user_id }).exec(function(error, profileuser){
							console.log(item.profile_user_id);
							console.log(item.user_id);
							console.log(profileuser);
								//const userDetail = await model.user.findOne({_id: new ObjectId(item.user_id) });
							var arr1 = [];
							arr1.push('<input type="checkbox" name="action_check[]" class="all_check" value="'+item._id+'">');				
							arr1.push(userDetail?userDetail.name:'--');
							arr1.push((profileuser && profileuser.name)?profileuser.name:'Admin');
							if(!item.status){
								change_status = "changeStatus(\'"+item._id+"\',1,\'candidate\');";						
								var rid = item._id;
								arr1.push('<p id="status_'+item._id+'"><span class="label label-info"><i title="Inactive" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="'+change_status+'">Inactive</i></span></p>');
							}else{
								change_status = "changeStatus(\'"+item._id+"\',0,\'candidate\');";
								arr1.push('<p id="status_'+item._id+'"><span class="label label-danger"><i title="Active" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="'+change_status+'">Active</i></span></p>');
							}
							
							var $but_delete = ' - ';
							if(perdata.delete =='1'){
								$but_delete = '<a href="javascript:void(0)" title="close" onclick="delete_data_all(this,\'candidate\',\'all\')" id="'+item._id+'">&nbsp;&nbsp;<button class="btn btn-circle text-danger" type="button"><i class="fa fa-close" ></i></button></a>';
							}
							arr1.push($but_delete);					
							arr.push(arr1);
							callback()
						});
					});
				},(err)=>{			
						cb(arr);
				})
			}else{
				cb(arr);
			}
	},

	change_status : (req, res) => {
		var rid = req.input('id')?req.input('id'):'';	
		return model.sortlisted_candidate.updateOne({_id: rid}, {
        	status: parseInt(req.body.st)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(req.body.st=='1'){
				res.send('<span  class="label label-danger"><i title="Active" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="changeStatus(\''+rid+'\',0,\'candidate\');">Active</i></span>');
			}
			else{
				res.send('<span  class="label label-info"><i title="Inactive" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="changeStatus(\''+rid+'\',1,\'candidate\');">Inactive</i></span>');
			}
		})
	},

	change_all_status : (req, res) => {
		var action_change = req.input('action_change')?req.input('action_change'):0;
		var action_check = req.input('action_check')?req.input('action_check'):[];
		if(action_change == "2"){
			model.sortlisted_candidate.updateMany({_id: {$in :action_check}}, {deleted_at: 1},function(err,data){
				res.json({status:"ok"});
	        });
		}
		if(action_change == "1" || action_change == "0"){
			var st = (action_change==1)?true:false;
			model.sortlisted_candidate.updateMany({_id: {$in :action_check}}, {status: st},function(err,data){
				res.json({status:"ok"});
	        });
		}
	},	
	

	delete : (req, res) => {
		 return model.sortlisted_candidate.updateOne({_id: req.input("id")}, {
            deleted_at: 1
        },function(err,data){        	
        	if(err) console.error(err);
        	res.send('done')
        })
	}
}
