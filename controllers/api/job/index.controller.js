const constant = require('../../../config/constant');
const jwt = require('jsonwebtoken');
module.exports = {
	list : (req, res) =>{
		const result = {};		
		const status = 200;
		result.data = [];
		result.status = status;
		res.status(status).send(result);
	}
	
}
