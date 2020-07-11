const system_configModel = require(`${appRoot}/models/system_config.model`);
var config = require('../../../config/index');
var async = require("async");
var self= module.exports  = {
	index: async (req,res)=>{
		var detail = await system_configModel.findOne({deleted_at : 0});
		if(req.method == "GET"){	
			config.helpers.permission('system_config', req, async function(err,permission){
				res.render('admin/system_config/edit.ejs', { layout : 'admin/layout/layout', permission : permission, detail : detail } );
			})
		}else{
			try{
				console.log(req.body);
				let update_data = {
					abuse_key : req.body.abuse_key
				}
				var systemConfig = await system_configModel.updateOne({ _id : req.body.id },update_data);
				res.redirect('/admin/system_config');
			}catch(err){
			  console.log(err)
			  res.json({success:false, status:200, data:null, msg:constants.SOMETHING_WENT_WRONG})
			}  				
		}
	}
	
}
