var indexController = require('../../controllers/admin/skillexp/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all('/admin/skillexps',isloggedin, indexController.index);
}