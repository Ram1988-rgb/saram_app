var indexController = require('../../controllers/admin/user/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
 router.all('/admin/user', isloggedin, indexController.index);
 router.all('/admin/user/all', isloggedin, indexController.all);
 router.all('/admin/user/add', isloggedin, indexController.add);
 router.all('/admin/user/edit/:id', isloggedin, indexController.edit);
 router.all('/admin/user/delete/:id',isloggedin, indexController.delete);
 router.all('/admin/user/change_status',isloggedin, indexController.change_status);
 router.all('/admin/user/change_all_status',isloggedin, indexController.change_all_status);
 router.all('/admin/user/check_email', indexController.check_email);
 router.all('/admin/user/check_email_edit/:id', indexController.check_email_edit);
 router.all('/admin/user/check_mobile', indexController.check_mobile);
 router.all('/admin/user/check_mobile_edit/:id', indexController.check_mobile_edit);
 router.get('/admin/user/profile/:id', indexController.userProfile);
 router.post('/admin/user/update-profile/:id', indexController.updateProfile);
 router.post('/admin/user/skill-exp', indexController.skillExp);
 router.post('/admin/user/subcategory', indexController.subcategory);
}
