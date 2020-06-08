var indexController = require('../../controllers/admin/staticpages/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
 router.all('/admin/staticpages', isloggedin, indexController.index); 
 router.all('/admin/staticpages/all', isloggedin, indexController.all);
 router.all('/admin/staticpages/add', isloggedin, indexController.add);
 router.all('/admin/staticpages/edit/:id', isloggedin, indexController.edit);
 router.all('/admin/staticpages/delete/:id',isloggedin, indexController.delete); 
 router.all('/admin/staticpages/change_status',isloggedin, indexController.change_status);  
 router.all('/admin/staticpages/change_all_status',isloggedin, indexController.change_all_status);  
}
