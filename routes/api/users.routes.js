var indexController = require('../../controllers/api/users/index.controller');
var {validateToken} = require('../../middleware/utils');
module.exports = function(router) {	
	router.post('/api/users/login',indexController.login);
	router.post('/api/users/registration', indexController.registration);
	router.post('/api/users/updateprofile', validateToken, indexController.updateprofile);
}
