var indexController = require('../../controllers/admin/setting/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
    router.post('/admin/setting/locality',indexController.getLocality)
}