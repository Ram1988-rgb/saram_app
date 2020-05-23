'use strict';

const categoryModel = require(`${appRoot}/models/category.model`);

async function addCategory(param){
  const newCategory = new categoryModel({
    name:param.name,
    code:param.code,
    description:param.description,
    cat_id:param.cat_id?param.cat_id:null,
    status:true,
    deleted_at:0,
    image:'',
    level:param.level
  })
  return await newCategory.save();
}

async function lastLevel(){
  return await categoryModel.findOne({deleted_at:0}).sort({level:'DESC'});
}

async function allCategory(req,res){
  return await categoryModel.find({deleted_at:0}).sort({level:"ASC"});
}

async function updateCategory(id,updData){
  return categoryModel.updateOne({_id:id},updData);
}

async function categoryDetail(id){
  return await categoryModel.findOne({_id:id});
}

async function editCategory(id, param) {
  const detail= {
    name:param.name,
    code:param.code,
    description:param.description,   
  }
  return await categoryModel.updateOne({_id:id},detail);
}

async function checkCode(param, catId){
  const search = {code:param.code};
  if(catId){
    search._id= {$ne:catId}
  }
  console.log(search);
  return await categoryModel.count(search);
}

async function upDateCategoryChild(id){
  const data =  await categoryModel.aggregate([
    {$match:{_id:id}},
    {
      $graphLookup: {
        from:"categories",
        startWith:'$_id',
        connectFromField:"_id",
        connectToField:"cat_id",
        as:"data"
      }
    }, 
    {$unwind:"$data"},
    { $replaceRoot: { newRoot: "$data" } },
    {$match:{deleted_at:0}},
    {
      $count:"passing_scores"
    }   
  ]);
  var count = 0;
  if(data && data.length>0){
     count = data[0].passing_scores?data[0].passing_scores:0
    
  }
  console.log({child:count},"???????????",{_id:id})
  return await categoryModel.updateOne({_id:id},{child:count});
}

async function allCategory(catId){
	var $arr = [];
	const data = await categoryModel.find({cat_id:catId});
	 for(let i=0;i<data.length;i++){
		 $arr.push(data[i])
	}
	return $arr;
}

module.exports ={
  addCategory,
  allCategory,
  updateCategory,
  categoryDetail,
  editCategory,
  lastLevel,
  checkCode,
  upDateCategoryChild
}
