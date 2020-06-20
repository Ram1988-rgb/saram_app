var indexController = require('../../controllers/api/job/index.controller');
var {validateToken} = require('../../middleware/utils');
module.exports = function(router) {
	router.get('/api/job/list', validateToken, indexController.list);
	router.get('/api/job/details', validateToken, indexController.deatils);
	router.get('/api/job/applyjob', validateToken, indexController.applyjob);
	router.post('/api/job/createJob', validateToken, indexController.createJob);
	router.post('/api/job/editJob', validateToken, indexController.editJob);
	router.get('/api/job/delete_job', validateToken, indexController.delete_job);
	router.get('/api/job/job_status', validateToken, indexController.job_status);
	
}
