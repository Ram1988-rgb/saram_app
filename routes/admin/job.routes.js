var indexController = require('../../controllers/admin/job/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
 router.all('/admin/job', isloggedin, indexController.index); 
 router.all('/admin/job/all', isloggedin, indexController.all);
 router.all('/admin/job/add', isloggedin, indexController.add);
 router.all('/admin/job/edit/:id', isloggedin, indexController.edit);
 router.all('/admin/job/delete/:id',isloggedin, indexController.delete); 
 router.all('/admin/job/change_status',isloggedin, indexController.change_status);  
 router.all('/admin/job/all_category',indexController.all_category);  
 router.all('/admin/job/get_locality',indexController.get_locality);  

}
