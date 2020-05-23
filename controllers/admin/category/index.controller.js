var model  = require('../../../models/index.model');
var config = require('../../../config/index');
var categoryModel = model.category;

class Category{
  async index(req,res){
    res.render('admin/category/view.ejs',{layout:'admin/layout/layout', data:{}} );
  }
}
module.exports = Category;
