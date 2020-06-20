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
var categoryModel  = require('../models/category.model');
var skill_libraryModel  = require('../models/skill_library.model');
var skilltypesModel  = require('../models/skilltypes.model');
var otpModel  = require('../models/otp.model');
var constant = require('../config/constant');
const request = require('request');

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

async function getlocalityList(){
    //cityId = mongoose.Types.ObjectId(cityId);
    return await localityModel.find({deleted_at:0});
}

async function getlocality(cityId){
    //cityId = mongoose.Types.ObjectId(cityId);
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
    }
    return await skillsModel.find(search);
}

async function uploadFile(files,fieldName,imgpath){
    if(files && Object.keys(files).length != 0 &&  files[fieldName] && files[fieldName].name) 
	{
      const imgname = Date.now()+'_'+files[fieldName].name;
      await files[fieldName].mv(imgpath+imgname);
      return imgname;
    }else{
      return "";
    }   
}

async function skillTypes(){
    return await skilltypesModel.find({deleted_at:0, status : true});
}

async function skillLibrary(){
    return await skill_libraryModel.find({deleted_at:0, status : true});
}

async function generateCoupon(params){
    const url = `${constant.SMS_URL}?workingkey=${constant.SMSWORKING_KEY}&sender=${constant.SENDER_CODE}&to=${params.phone}&message=${params.message}`;
    
    request(url, async function (error, response, body) {
        if(body){
            var detail = {
                mobile:params.phone,
                otp:params.otp,
                purpose:params.purpose,
                message:params.message,
                deleted_at	: 0
            }
            const newOtp = new otpModel(detail);
             await newOtp.save();
             return true;
        }else{
            return false;
        }
    })    
}

async function verifyOtp(params){
    const data = await otpModel.find({mobile:params.phone,purpose:params.purpose,otp:params.otp}).sort({_id:-1});
    if(data && data.length){
        const detail = data[0];
        var createdAt = (detail.createdAt).valuOf();
        var currentDate = new Date().valueOf();
        const difftime = parseInt(currentDate)-parseInt(currentDate);
        otpTime = constant.OTPVALIDITY *1000;
        if(difftime<=otpTime){
            return {success:true, message:"Otp has been verified successfully"}
        }
        return {success:true, message:"Otp has been expired"}
    }
    return {success:false, message:"Please enter valid otp"}
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
    uploadFile,
    getlocalityList,
    skillTypes,
    skillLibrary,
    verifyOtp
}
