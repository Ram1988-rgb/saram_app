var indexController = require('../../controllers/admin/job/index.controller');
var userjobsController = require('../../controllers/admin/userjobs/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
 router.all('/admin/job', isloggedin, indexController.index); 
 router.all('/admin/job/all', isloggedin, indexController.all);
 router.all('/admin/job/add', isloggedin, indexController.add);
 router.all('/admin/job/edit/:id', isloggedin, indexController.edit);
 router.all('/admin/job/delete/:id',isloggedin, indexController.delete); 
 router.all('/admin/job/change_status',isloggedin, indexController.change_status);  
 router.all('/admin/job/change_all_status',isloggedin, indexController.change_all_status);  
 router.all('/admin/job/all_category',indexController.all_category);  
 router.all('/admin/job/get_locality',indexController.get_locality);  


 router.all('/admin/userjobs',isloggedin, userjobsController.index);
 router.all('/admin/userjobs/all', isloggedin, userjobsController.all);
 router.all('/admin/userjobs/delete/:id',isloggedin, userjobsController.delete); 
 router.all('/admin/userjobs/change_status',isloggedin, userjobsController.change_status); 
 router.all('/admin/userjobs/change_all_status',isloggedin, userjobsController.change_all_status); 

}
