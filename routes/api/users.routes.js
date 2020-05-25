var indexController = require('../../controllers/api/users/index.controller');
var validateToken = require('../../middleware/utils').validateToken;
module.exports = function(router) {
	router.get('/api/users/generate_token', indexController.generate_token);
}
