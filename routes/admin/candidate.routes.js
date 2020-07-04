var indexController = require('../../controllers/admin/candidate/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all('/admin/candidate',isloggedin, indexController.index);
    router.all('/admin/candidate/all', isloggedin, indexController.all);
    router.all('/admin/candidate/delete/:id',isloggedin, indexController.delete); 
    router.all('/admin/candidate/change_status',isloggedin, indexController.change_status); 
    router.all('/admin/candidate/change_all_status',isloggedin, indexController.change_all_status); 

}
