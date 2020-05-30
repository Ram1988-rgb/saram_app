var cityModel  = require('../models/city.model');
var localityModel  = require('../models/locality.model');
var countryModel  = require('../models/country.model');
var lKnowModel  = require('../models/languageknow.model');
var adProofModel  = require('../models/addressproof.model');
var pIdProofModel  = require('../models/photoidproof.model');
var designaitorModel  = require('../models/designation.model');
var skillsModel  = require('../models/skills.model');
var usersModel  = require('../models/user.model');
var jobtypesModel  = require('../models/jobtypes.model');

const mongoose = require('mongoose');

async function getCountry(){
    return await countryModel.find({deleted_at:0});
}

async function getCity(countryId){
    const search = {deleted_at:0}
    if(countryId){
        search.country_id =countryId
    }
    return await cityModel.find(search);
}

async function getUers(){
    const search = {deleted_at:0}
    return await usersModel.find(search);
}

async function jobType(){	
    return await jobtypesModel.find();
}

async function getlocality(cityId){
    //cityId = mongoose.Types.ObjectId(cityId);
    console.log({city_id:cityId});
    return await localityModel.find({deleted_at:0, city_id:cityId});
}

async function langKnown(){
    return await lKnowModel.find();
}

async function addressProof(){
    return await adProofModel.find();
}

async function photoIdProof(){
    return await pIdProofModel.find();
}

async function allDesignaitor(catId=null){
    const search = {deleted_at:0}
    if(catId){
        search.cat_id =catId
    }
    return await designaitorModel.find(search);
}

async function allSkills(catId=null){
    const search = {deleted_at:0}
    if(catId){
        search.cat_id =mongoose.Types.ObjectId(catId)
    }console.log(search)
    return await skillsModel.find(search);
}

async function uploadFile(files,fieldName,imgpath){
    if(files && Object.keys(files).length != 0) 
		{
      const imgname = Date.now()+'_'+files[fieldName].name;
      await files[fieldName].mv(imgpath+imgname);
      return imgname;
    }else{
      return "";
    }   
}

module.exports = {
    getCountry,
    getCity,
    getlocality,
    langKnown,
    addressProof,
    photoIdProof,
    allDesignaitor,
    allSkills,
    getUers,
    jobType,
    uploadFile
}
