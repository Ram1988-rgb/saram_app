const model  = require('../../../models/index.model');
const constant = require('../../../config/constant');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
module.exports = {
	list : async (req, res) =>{		
		const resut_data = await model.job.find({ status : true, deleted_at : 0})
		const result = {};		
		const status = HttpStatus.OK;
		result.data = resut_data;
		result.status = status;
		res.status(status).send(result);
	}
}
