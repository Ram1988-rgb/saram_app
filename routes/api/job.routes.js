var indexController = require('../../controllers/api/job/index.controller');
var {validateToken} = require('../../middleware/utils');
module.exports = function(router) {
	router.get('/api/job/list', validateToken, indexController.list);
}
