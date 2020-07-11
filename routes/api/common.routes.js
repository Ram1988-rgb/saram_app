var commonController = require('../../controllers/api/common/index.controller');
var {validateToken} = require('../../middleware/utils');
module.exports = function(router) {	
	
	router.get('/api/common/category', validateToken, commonController.category);
	router.get('/api/common/country_data', validateToken, commonController.country_data);
	router.get('/api/common/miscellaneous', commonController.miscellaneous);
	router.get('/api/common/skill_library', validateToken, commonController.skill_library);
	
}
