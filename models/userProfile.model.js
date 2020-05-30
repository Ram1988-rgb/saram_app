const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserProfileSchema = new Schema({
    city_id : { type : { type : mongoose.Schema.Types.ObjectId, ref : "city"} },
    user_id : { type : { type : mongoose.Schema.Types.ObjectId, ref : "user"} },
    locality_id : { type : {type:mongoose.Schema.Types.ObjectId, ref : "locality"} },
    category_id : [{type:mongoose.Schema.Types.ObjectId, ref:"category"}],
    skill_id : [{type:mongoose.Schema.Types.ObjectId, ref:"skill"}],
    designation_id : [{type:mongoose.Schema.Types.ObjectId, ref:"designation"}],
    language_id : [{type:mongoose.Schema.Types.ObjectId, ref:"languageknow"}],
    address_id : [{type:mongoose.Schema.Types.ObjectId, ref:"addressproof"}],
    photoproof_id : [{type:mongoose.Schema.Types.ObjectId, ref:"photoidproofs"}],
    resume : { type : String },
    current_salary : { type : String },
    company_name : { type : String },
    experience : { type : Number },
    age : { type : Number },
    gender : { type : String },
    passport 	: { type : Boolean },
    diploma 	: { type : Boolean },   
	status 	: { type : Boolean },
    deleted_at	: { type : Number},   
    createdAt	: {
        type : Date,
        default : Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }  
})

module.exports = mongoose.model('UserProfile', UserProfileSchema);
