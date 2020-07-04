var indexController = require('../../controllers/api/rating_review/index.controller');
var {validateToken} = require('../../middleware/utils');
module.exports = function(router) {		
	router.post('/api/rating_review/jobrating', indexController.jobrating);	
	router.post('/api/rating_review/candidaterating', indexController.candidaterating);	
	router.get('/api/rating_review/rating_list', indexController.rating_list);	
}
