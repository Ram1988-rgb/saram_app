var indexController = require('../../controllers/admin/system_config/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
 router.all('/admin/system_config', isloggedin, indexController.index); 
}
