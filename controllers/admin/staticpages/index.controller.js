var model  = require('../../../models/index.model');
var config = require('../../../config/index');
var async = require("async");
var bcrypt = require("bcrypt-nodejs");
var mongoose = require('mongoose');
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const pagesService = require(`${appRoot}/services/admin/pages.js`);
const ObjectId = require('mongodb').ObjectId;
var self= module.exports  = {
	index: async (req,res)=>{
		const data_search = await config.helpers.search_url.static_list(req);
		
		if(data_search!=""){
			return res.redirect(config.constant.ADMINSITEURL+"staticpages"+data_search);
		  }
		config.helpers.permission('staticpages', req, (err,permission)=>{
			res.render('admin/staticpages/view.ejs',{layout:'admin/layout/layout',permission:permission} );
		});
	},
        all:(req,res)=>{
		var search = {deleted_at:0}
		if(req.body.name){
			search.title = { $regex: '.*' + req.body.name + '.*',$options:'i' }
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
                          var count=model.staticpages.countDocuments(search);
                          resolve(count);
                      });
                      var fetchData = new Promise((resolve, reject) => {
                          var data=model.staticpages.find(search).skip(skip).limit(limit).sort({createdAt: dir});
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
			config.helpers.permission('staticpages', req, (err,perdata)=>{
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
			console.log(alldata.length);
			if(alldata.length>0){
				async.eachSeries(alldata, (item,callback)=>{
						var arr1 = [];
						arr1.push('<input type="checkbox" name="action_check[]" class="all_check" value="'+item._id+'">');				
						arr1.push(item.title);
						if(!item.status){
							change_status = "changeStatus(\'"+item._id+"\',1,\'staticpages\');";						
							var rid = item._id;
							arr1.push('<p id="status_'+item._id+'"><span class="label label-info"><i title="Inactive" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="'+change_status+'">Inactive</i></span></p>');
						}else{
							change_status = "changeStatus(\'"+item._id+"\',0,\'staticpages\');";
							arr1.push('<p id="status_'+item._id+'"><span class="label label-danger"><i title="Active" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="'+change_status+'">Active</i></span></p>');
						}
						var $but_edit = '-';
						if(perdata.edit=='1'){
							$but_edit = '<a href="/admin/staticpages/edit/'+item._id+'" title="edit"><button class="btn btn-circle text-inverse" type="button"><i class="fa fa-pencil"></i> </button></a>';
						}
						var $but_delete = ' - ';
						if(perdata.delete =='1'){
							$but_delete = '<a href="javascript:void(0)" title="close" onclick="delete_data_all(this,\'staticpages\',\'all\')" id="'+item._id+'">&nbsp;&nbsp;<button class="btn btn-circle text-danger" type="button"><i class="fa fa-close" ></i></button></a>';
						}
						arr1.push($but_edit+$but_delete);					
						arr.push(arr1);
						callback()
				},(err)=>{			
					cb(arr);
				})

			}else{
				cb(arr);
			}
	},

	add : async (req,res) => {
		if(req.method == "GET"){
			config.helpers.permission('staticpages', req, async function(err,permission){
				res.render('admin/staticpages/add.ejs',{layout:'admin/layout/layout',permission : permission } );
			})
		}else{
			try{
				console.log(req.body);
			  const jobData = await pagesService.addPages(req.body);			  
			  if(jobData){
				res.redirect('/admin/staticpages');
			  }
			}catch(err){
			  console.log(err)
			  res.json("somthing went wrong")
			}				
		}
	},

	edit : async (req, res) => {
		var id = req.input('id');
		var detail = await model.staticpages.findOne({ _id : id});
		if(req.method == "GET"){
			if(detail){					
				config.helpers.permission('staticpages', req, async function(err,permission){
					res.render('admin/staticpages/edit.ejs',{layout:'admin/layout/layout',permission:permission,detail:detail } );
				})
			}else{
				res.redirect('/admin/staticpages')
			}
		}else{
			try{
				console.log(req.body);
			  const jobData = await pagesService.editPages(req.body.id, req.body);
			  if(jobData){
				res.redirect('/admin/staticpages');
			  }
			}catch(err){
			  console.log(err)
			  res.json({success:false, status:200, data:null, msg:constants.SOMETHING_WENT_WRONG})
			}  				
		}
	},            

	change_status : (req, res) => {
		var rid = req.input('id')?req.input('id'):'';	
		return model.staticpages.updateOne({_id: rid}, {
        	status: parseInt(req.body.st)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(req.body.st=='1'){
				res.send('<span  class="label label-danger"><i title="Active" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="changeStatus(\''+rid+'\',0,\'staticpages\');">Active</i></span>');
			}
			else{
				res.send('<span  class="label label-info"><i title="Inactive" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="changeStatus(\''+rid+'\',1,\'staticpages\');">Inactive</i></span>');
			}
		})
	},

	change_all_status : (req, res) => {
		var action_change = req.input('action_change')?req.input('action_change'):0;
		var action_check = req.input('action_check')?req.input('action_check'):[];
		if(action_change == "2"){
			model.staticpages.updateMany({_id: {$in :action_check}}, {deleted_at: 1},function(err,data){
				res.json({status:"ok"});
	        });
		}
		if(action_change == "1" || action_change == "0"){
			var st = (action_change==1)?true:false;
			model.staticpages.updateMany({_id: {$in :action_check}}, {status: st},function(err,data){
				console.log(err);
				res.json({status:"ok"});
	        });
		}
	},
	
	delete : (req, res) => {
		 return model.staticpages.updateOne({_id: req.input("id")}, {
            deleted_at: 1
        },function(err,data){        	
        	if(err) console.error(err);
        	res.send('done')
        })
	}
	
}
