var model  = require('../../../models/index.model');
var config = require('../../../config/index');
const categoryService = require(`${appRoot}/services/admin/category.js`)
const commanHelper = require(`${appRoot}/helpers/comman.helper`)
const {constants} = require(`${appRoot}/config/string`)


class Category{
  async index(req,res){
    upDateCategoryChild();
    res.render('admin/category/view.ejs',{layout:'admin/layout/layout', data:{}} );
  }
  async add(req,res){
    try{
      const catData = await categoryService.lastLevel();
      const maxLevel = (catData && catData.level)?parseInt(catData.level):0
      req.body.level = maxLevel+1;
      const categoryData = await categoryService.addCategory(req.body);
      if(categoryData){
        res.redirect('/admin/category');
      }
    }catch(err){
      console.log(err)
      res.json("somthing went wrong")
    }
  }

  async edit(req,res) {
    try{
      const categoryData = await categoryService.editCategory(req.params.id, req.body);
      if(categoryData){
        res.redirect('/admin/category');
      }
    }catch(err){
      console.log(err)
      res.json({success:false, status:200, data:null, msg:constants.SOMETHING_WENT_WRONG})
    }
  }

  async categoryDetail(req,res){
    try{
      const catData = await categoryService.categoryDetail(req.params.id);
      const designaitors = await commanHelper.allDesignaitor(req.params.id);
      const skills = await commanHelper.allSkills(req.params.id);
      res.json({success:true, status:200, data:catData, designaitors:designaitors, skills:skills, msg:''})
    }catch(err){
      console.log(err)
      res.json({success:false, status:200, data:null, msg:constants.DATA_NOT_FOUNd})
    }
  }

  async allCategory(req,res){
    try{
      const categoryData = await categoryService.allCategory({});
      res.json({success:true, status:200, data: categoryData})
    }catch(err){
		console.log(err);
      res.json({success:false, status:200, data: []})
    }
  }

  async reorder(req,res){
    const update_reorder ={};
		const source = req.body.source;
		const destination = (req.body.destination == 'null') ? '' : req.body.destination;
		const rootOrder = req.body.rootOrder?JSON.parse(req.body.rootOrder):[];
		const order = JSON.parse(req.body.order);
    update_reorder.cat_id = destination?destination:null;
    await categoryService.updateCategory(source, update_reorder);
    if(order.length>0){
      for(var i=0;i<order.length;i++){
        await categoryService.updateCategory(order[i],{level:parseInt(i)})
      }
    }
    if(rootOrder.length>0){
      for(var i=0;i<rootOrder.length;i++){
        await categoryService.updateCategory(rootOrder[i],{level:parseInt(i)})
      }
    }
    res.json({status:'ok'});
  }

  async deleteCategory(req,res){
    try{
      const id = req.params.id;
      await categoryService.updateCategory(id,{deleted_at:1});
      res.json({success:false, status:200, data:null, msg:constants.DATA_DELETED})
    }catch(err){
      console.log(err)
      res.json({success:false, status:200, data:null, msg:constants.DATA_NOT_FOUNd})
    }
  }

  async checkCode(req,res){
    try{
      const catId= req.query.cat_id;
      const count = await categoryService.checkCode(req.body, catId);
      if(count && count>0){
        res.json({valid:false, message:constants.CATEGORY_CODE_EXIST})
      }else{
        res.json({valid:true, message:""})
      }
    }catch(err){
      console.log(err)
      res.json({valid:false, status:200, data:null, msg:constants.DATA_NOT_FOUNd})
    }
  }

  async upDateCategoryChild(req,res){
    const catData = await categoryService.allCategory();

    for(let i=0;i<catData.length;i++){
        const data = await categoryService.upDateCategoryChild(catData[i]._id);
      }
    return ({success:true})

  }
  async saveSkills(req,res){
    var skillsAdd = req.body.skills_add?req.body.skills_add:'';
    if(typeof skillsAdd == "string"){
      skillsAdd = [skillsAdd];
    }
    const skills = req.body.skills;
    const sk =[];
    for(var key in skills){
      sk.push(key);
    }

    await categoryService.deleteSkills(sk);
    await categoryService.updateSkills(skills);
    if(skillsAdd.length>0){
     await categoryService.addSkills(skillsAdd, req.body.catId);
    }
    res.json({success:true})
  }

  async saveDesignaitor(req,res){
    try{
      var designaitorAdd = req.body.designaitor_add?req.body.designaitor_add:'';
      if(typeof designaitorAdd == "string"){
        designaitorAdd = [designaitorAdd];
      }
      const designaitor = req.body.designaitor;
      const sk =[];
      for(var key in designaitor){
        sk.push(key);
      }

      await categoryService.deleteDesignaitor(sk);
      await categoryService.updateDesignaitor(designaitor);
      if(designaitorAdd.length>0){
      await categoryService.addDesignaitor(designaitorAdd, req.body.catId);
      }
      res.json({success:true})
    }catch(err){
      console.log(err)
      res.json({success:false})
    }
  }

  async getSkillsDesign(req,res){
    try{
      const catId = (req.body.catId)?(req.body.catId).split(','):[];
      const skills = await categoryService.getSkills(catId);
      const design = await categoryService.getDesign(catId);
      return res.json({success:false,data:{design:design, skills:skills} })
    }catch(err){
      console.log(err)
      res.json({success:false,data:null, msg:constants.DATA_NOT_FOUNd })
    }

  }

}
async function upDateCategoryChild(){
  const catData = await categoryService.allCategory();
  for(let i=0;i<catData.length;i++){
      const data = await categoryService.upDateCategoryChild(catData[i]._id);
    }
  return ({success:true})
}

module.exports = Category;
