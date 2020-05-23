var indexController = require('../../controllers/admin/dashboard/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all('/admin/dashboard', indexController.index); 
    router.all('/admin/allmenu', isloggedin, indexController.allmenu); 
   
}