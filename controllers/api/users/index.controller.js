const constant = require('../../../config/constant');
const jwt = require('jsonwebtoken');
module.exports = {
	generate_token : (req, res) =>{
		const result = {};
		const payload = { user : "sram app", exp : Math.floor(Date.now() / 1000) + (60 * 60 * 24)};               
		const secret = constant.JWT_SECRET;
		const token = jwt.sign(payload, secret);
		const status = 200;
		result.token = token;
		result.status = status;
		res.status(status).send(result);
	}
	
}
