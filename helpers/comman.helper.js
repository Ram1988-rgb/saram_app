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

async function generateOtp(params){
    const url = `${constant.SMS_URL}?workingkey=${constant.SMSWORKING_KEY}&sender=${constant.SENDER_CODE}&to=${params.mobile}&message=${params.message}`;
    
    request(url, async function (error, response, body) {
        console.log(body);
        console.log('========response========');
        console.log(error);
        if(body){
            var detail = {
                mobile:params.mobile,
                otp:params.otp,
                purpose:params.purpose,
                message:params.message,
                deleted_at	: 0
            }
            const newOtp = new otpModel(detail);
             return await newOtp.save();
        }else{
            return false;
        }
    })    
}

async function verifyOtp(params){
    var moment = require('moment');
    const data = await otpModel.find({used:0,mobile:params.mobile,purpose:params.purpose,otp:params.otp}).sort({_id:-1});
    if(data && data.length){
        const detail = data[0];
        console.log(detail.createdAt)
        var createdAt =  moment(detail.createdAt).valueOf();
        var currentDate = new Date().getTime();
        const difftime = parseInt(currentDate)-parseInt(createdAt);
        console.log(difftime)
        otpTime = constant.OTPVALIDITY *100000;
        if(difftime<=otpTime){
            await otpModel.updateOne({_id:detail._id},{used:1});
            return {success:true, message:"Otp has been verified successfully"}
        }
        return {success:false, message:"Otp has been expired"}
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
    verifyOtp,
    generateOtp
}
