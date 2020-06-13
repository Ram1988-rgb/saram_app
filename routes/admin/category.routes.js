var categoryController = require('../../controllers/admin/category/index.controller');
const category = new categoryController();
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;

module.exports = function(router) {
	router.all('/admin/category', isloggedin, category.index);
	router.get('/admin/category/get-category/:id', isloggedin, category.categoryDetail);
	router.get('/admin/all-category', category.allCategory);
	router.post('/admin/category/add', isloggedin, category.add);
	router.post('/admin/category/edit/:id', isloggedin, category.edit);
	router.post('/admin/category/reorder', isloggedin, category.reorder);
	router.post('/admin/category/delete/:id', isloggedin, category.deleteCategory);
	router.post('/admin/category/check-code', isloggedin, category.checkCode);
	router.get('/admin/category/getData', isloggedin, category.upDateCategoryChild);
	router.post('/admin/category/save-skills', isloggedin, category.saveSkills);
	router.post('/admin/category/save-designaitor', isloggedin, category.saveDesignaitor);
	router.post('/admin/category/get-skills-design', isloggedin, category.getSkillsDesign);

}
