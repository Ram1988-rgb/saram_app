var indexController = require('../../controllers/api/users/index.controller');
var all_listController = require('../../controllers/api/all_list/index.controller');
var {validateToken} = require('../../middleware/utils');
module.exports = function(router) {	
	router.post('/api/users/login',indexController.login);
	router.post('/api/users/registration', indexController.registration);
	router.get('/api/users/applyjob', validateToken, indexController.applyjob);
	router.post('/api/users/updateprofile', validateToken, indexController.updateprofile);
	router.get('/api/all_list/list', validateToken, all_listController.list);
	
}
