var express = require('express');

module.exports = function(app) {

	//routes defaile
	var usersRoutes = require('./api/users.routes');	
	var jobRoutes = require('./api/job.routes');
	var commonRoutes = require('./api/common.routes');	
        //import express
	var router = express.Router();
	app.use('',router);

	//import api routes
	usersRoutes(router);
	jobRoutes(router);
	commonRoutes(router);
}
