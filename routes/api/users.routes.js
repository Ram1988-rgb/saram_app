var indexController = require('../../controllers/api/users/index.controller');
var {validateToken} = require('../../middleware/utils');
module.exports = function(router) {	
	router.post('/api/users/login',indexController.login);
	router.post('/api/users/registration', indexController.registration);
	router.get('/api/users/applyjob', validateToken, indexController.applyjob);
	router.post('/api/users/updateprofile', validateToken, indexController.updateprofile);
	router.get('/api/users/getProfile', validateToken, indexController.getProfile);
	router.get('/api/users/candidateSearch', validateToken, indexController.candidateSearch);
	router.post('/api/users/generateotp', indexController.generateOtp);
	router.post('/api/users/verifyotp', indexController.verifyOtp);
	
}
