var categoryController = require('../../controllers/admin/category/index.controller');
const category = new categoryController();
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;

module.exports = function(router) {
	router.all('/admin/category',isloggedin, category.index);
  
}
