const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const commanHelper = require(`${appRoot}/helpers/comman.helper`);
const async = require("async");
const bcrypt = require("bcrypt-nodejs");
const ObjectId = require('mongodb').ObjectId;
const userService = require(`${appRoot}/services/admin/user`);
const constants = require(`${appRoot}/config/constant`);

var self= module.exports  = {
	index:(req,res)=>{
		config.helpers.permission('user', req, (err,permission)=>{
			res.render('admin/user/view.ejs',{layout:'admin/layout/layout',permission:permission} );
		});
	},
        all:(req,res)=>{
		var search = {deleted_at:0}
		var search_val = req.input('search')?req.input('search')['value']:''
		if(search_val){
                   search.name = { $regex: '.*' + search_val + '.*',$options:'i' }
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
                          var count=model.user.countDocuments(search);
                          resolve(count);
                      });
                      var fetchData = new Promise((resolve, reject) => {
                          var data=model.user.find(search).skip(skip).limit(limit).sort({createdAt: dir});
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
			config.helpers.permission('user', req, (err,perdata)=>{
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
				async.eachSeries(alldata,(item,callback)=>{
					var arr1 = [];
					arr1.push('<input type="checkbox" name="action_check[]" class="all_check" value="'+item._id+'">');
					arr1.push(item.name?item.name:'--');
					arr1.push(item.email?item.email:'--');
					arr1.push(item.mobile?item.mobile:'--')
					var type = "Provider";
					if(item.seeker == 1){
						type = "Provider/Seeker";
					}
					arr1.push(type);

					arr1.push('<a href="/admin/user/profile/'+item._id+'" title="User Profile"><button class="btn btn-circle text-inverse" type="button"><i class="glyphicon glyphicon-user"></i> </button></a>');

					if(!item.status){
						change_status = "changeStatus(\'"+item._id+"\',1,\'user\');";
						var rid = item._id;
						arr1.push('<p id="status_'+item._id+'"><span class="label label-info"><i title="Inactive" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="'+change_status+'">Inactive</i></span></p>');
					}else{
						change_status = "changeStatus(\'"+item._id+"\',0,\'user\');";
						arr1.push('<p id="status_'+item._id+'"><span class="label label-danger"><i title="Active" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="'+change_status+'">Active</i></span></p>');
					}
					var $but_edit = '-';
					if(perdata.edit=='1'){
						$but_edit = '<a href="/admin/user/edit/'+item._id+'" title="edit"><button class="btn btn-circle text-inverse" type="button"><i class="fa fa-pencil"></i> </button></a>';
					}
					var $but_delete = ' - ';
					if(perdata.delete =='1'){
						$but_delete = '<a href="javascript:void(0)" title="close" onclick="delete_data_all(this,\'user\',\'all\')" id="'+item._id+'">&nbsp;&nbsp;<button class="btn btn-circle text-danger" type="button"><i class="fa fa-close" ></i></button></a>';
					}
					arr1.push($but_edit + $but_delete);
					var action = '<div class="btn-group"><a href="#" data-toggle="dropdown" class="btn dropdown-toggle btn--icon"></i>---<span class="caret"></span></a><ul class="dropdown-menu" style="z-index:1;position:relative;"><li><a href="/admin/user/edit/'+item._id+'" title="edit">Edit</a></li><li><a href="javascript:void(0)" title="close" onclick="delete_data_all(this,\'user\',\'all\')" id="'+item._id+'">Delete</a></li></ul></div>';
					arr1.push(action);
					
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
			var proof_type = await commanHelper.photoIdProof();		
			config.helpers.permission('user', req, function(err,permission){
				res.render('admin/user/add.ejs',{layout:'admin/layout/layout',permission:permission, proof_type : proof_type } );
			})
		}else{			
			try{
				const imageProof = await commanHelper.uploadFile(req.files,'photo_proof',constants.UPLOAD_USER_PHOTOID)
				const imageProfile = await commanHelper.uploadFile(req.files,'photo_profile',constants.UPLOAD_USER_PROFILE)
				if(imageProof){
					req.body.photoId = imageProof;
				}
				if(imageProfile){
					req.body.image = imageProfile;
				}
				req.body.createdby = 'admin';				
				const userData = await userService.add(req);
				if(userData){
					req.flash('message', req.__('Your account has been created successfully'));
					res.redirect('/admin/user')
				}
			}catch(err){
				console.log(err)
				req.flash('message', req.__('somthing went wrong'));
				res.redirect('/admin/user/add')
			}		
		}
	},

	edit : async (req, res) => {
		var id = req.input('id');
		var proof_type = await commanHelper.photoIdProof();
		const userData = await userService.getProfile(id);	
		if(req.method == "GET"){
			if(userData){			
				config.helpers.permission('user', req, function(err,permission){
					res.render('admin/user/edit.ejs',{layout:'admin/layout/layout',permission:permission,detail:userData, proof_type : proof_type} );
				})
			}else{
				res.redirect('/admin/user')
			}
		}else{
			try{
				const imageProof = await commanHelper.uploadFile(req.files,'photo_proof',constants.UPLOAD_USER_PHOTOID)
				const imageProfile = await commanHelper.uploadFile(req.files,'photo_profile',constants.UPLOAD_USER_PROFILE)
				if(imageProof){
					req.body.photoId = imageProof;
				}
				if(imageProfile){
					req.body.image = imageProfile;
				}
				const userData = await userService.edit(id, req);
				if(userData){
					req.flash('message', req.__('Data has been updated Successfully'));
					res.redirect('/admin/user');
				}
			}catch(err){
				console.log(err);
				req.flash('message', req.__('somthing went wrong'));
				res.redirect('/admin/user/edit/'+id);
			}			
		}
	},            

	change_status : (req, res) => {
		var rid = req.input('id')?req.input('id'):'';
		return model.user.updateOne({_id: rid}, {
        	status: parseInt(req.body.st)
		},function(err,data){
			if(err) console.error(err);
			if(req.body.st=='1'){
				res.send('<span  class="label label-danger"><i title="Active" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="changeStatus(\''+rid+'\',0,\'user\');">Active</i></span>');
			}
			else{
				res.send('<span  class="label label-info"><i title="Inactive" style="background-repeat:no-repeat; cursor:pointer;" class="color_active" onclick="changeStatus(\''+rid+'\',1,\'user\');">Inactive</i></span>');
			}
		})
	},

	change_all_status : (req, res) => {
		var action_change = req.input('action_change')?req.input('action_change'):0;
		var action_check = req.input('action_check')?req.input('action_check'):[];
		if(action_change == "2"){
			model.user.updateMany({_id: {$in :action_check}}, {deleted_at: 1},function(err,data){
				res.json({status:"ok"});
	        });
		}
		if(action_change == "1" || action_change == "0"){
			var st = parseInt(action_change)//(action_change==1)?true:false;
			model.user.updateMany({_id: {$in :action_check}}, {status: st},function(err,data){
				res.json({status:"ok"});
	        });
		}
	},

	delete : (req, res) => {
		 return model.user.updateOne({_id: req.input("id")}, {
            deleted_at: 1
        },function(err,data){
        	if(err) console.error(err);
        	res.send('done')
        })
	},

	check_email : function(req, res) {
		model.user.findOne({email:req.input('email')}).exec(function(err,user){
		if(err){console.log(err)}
			if(user){
				res.json({"valid": false,"message":req.__("This email is already register, please choose another")})
			}else{
				res.json({"valid":true})
			}
		})
	},

	check_mobile : function(req, res) {
		model.user.findOne({mobile: parseInt(req.input('mobile'))}).exec(function(err,user){
		if(err){console.log(err)}
			if(user){
				res.json({"valid": false,"message":req.__("This mobile is already register, please choose another")})
			}else{
				res.json({"valid":true})
			}
		})
	},

	check_email_edit : function(req, res) {
		model.user.findOne({ _id :{ $ne: new ObjectId(req.input('id'))}, email : req.input('email')}).exec(function(err,user){
		console.log(user);
		if(err){console.log(err)}
			if(user){
				res.json({"valid": false,"message":req.__("This email is already register, please choose another")})
			}else{
				res.json({"valid":true})
			}
		})
	},

	check_mobile_edit : function(req, res) {
		model.user.findOne({ _id :{ $ne: new ObjectId(req.input('id'))}, mobile: parseInt(req.input('mobile'))}).exec(function(err,user){
		if(err){console.log(err)}
			if(user){
				res.json({"valid": false,"message":req.__("This mobile is already register, please choose another")})
			}else{
				res.json({"valid":true})
			}
		})
	},

	userProfile:async function (req,res){
	  const userData = await userService.getProfile(req.params.id);
	  const city = await commanHelper.getCity();
	  const lKnow = await commanHelper.langKnown();
	  const adProof = await commanHelper.addressProof();
	  const pIdProof = await commanHelper.photoIdProof();
	  const designaitor = await commanHelper.allDesignaitor();
	  const skills = await commanHelper.allSkills();
	  const job_type = await commanHelper.jobType();
	  const category = await model.category.find({deleted_at:0, cat_id : null });
	  
	  res.render('admin/user/profile.ejs',{
		  layout:'admin/layout/layout',
			userData:userData,
			city:city, lKnow:lKnow,
			adProof:adProof,
			pIdProof:pIdProof,
			designaitor:designaitor,
			skills:skills,
			job_type : job_type,
			category:category
		});
	},

	updateProfile: async function(req,res){
		const userId = req.body.id;
		
		try{
			const resume = await commanHelper.uploadFile(req.files, 'resume', constants.UPLOAD_USER_RESUME)
			req.body.resume_name = resume?resume:'';
			req.body.user_id = req.body.id;
			console.log(req.body.id)
			const userProfile = await userService.addUserProfile(req);
			if(userProfile){
				await model.user.updateOne({ _id : req.body.id }, { seeker : 1 });
			  	res.redirect('/admin/user');
			}
		  }catch(err){
				console.log(err)				
				res.redirect('/admin/user/profile/'+userId);
		 }  	
	},

	skillExp: async function(req,res){
		try{
			const catData = await model.category.findOne({_id:req.body.id});
			const code = catData.skillexp?catData.skillexp:'SKILL';
			const detail = await model.skill_library.find({deleted_at:0, code:code});
			res.json({success:true, detail:detail, code:code})
		 }catch(err){
				console.log(err)				
				res.json({success:false, message:err.message})
		 }  

	},

	subcategory: async function(req,res){
		try{
			let cat_id = req.body.id ?  new ObjectId(req.body.id) : null;
			const catData = await model.category.find({ cat_id : cat_id, deleted_at : 0, status : true});
			res.json({ success : true, detail:catData })
		 }catch(err){
				console.log(err)				
				res.json({success:false, message:err.message})
		 }  

	}

}
