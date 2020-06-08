var express = require('express');

module.exports = function(app) {

	//routes defaile
	var adminRoutes = require('./admin/admin.routes');
	var administrator = require('./admin/administrator.routes');
	var roleRoutes = require('./admin/role.routes');
	var dashboardRoutes = require('./admin/dashboard.routes');
	var userRoutes = require('./admin/user.routes');
	var jobRoutes = require('./admin/job.routes');
	var staticpagesRoutes = require('./admin/staticpages.routes');
	var managepageRoutes = require('./admin/managepage.routes');
	var categoryRoutes = require('./admin/category.routes');
	var settingRoutes = require('./admin/setting.routes');
        //import express
	var router = express.Router();
	app.use('',router);

	//import admin routes
	adminRoutes(router);
	dashboardRoutes(router);
	administrator(router);
	roleRoutes(router);
	userRoutes(router);
	jobRoutes(router);
	managepageRoutes(router);
	categoryRoutes(router);
	settingRoutes(router);
	staticpagesRoutes(router);
}
