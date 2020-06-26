const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserProfileSchema = new Schema({
    city_id : { type : mongoose.Schema.Types.ObjectId, ref : "City"},
    user_id :  { type : mongoose.Schema.Types.ObjectId, ref : "User"},
    locality_id : {type:mongoose.Schema.Types.ObjectId, ref : "Locality"},
    category_id : {type:mongoose.Schema.Types.ObjectId, ref:"Category"},
    subcategory_id : [{type:mongoose.Schema.Types.ObjectId, ref:"Category"}],
    //skill_id : [{type:mongoose.Schema.Types.ObjectId, ref:"Skill_library"}],
    skill_name:{ type : Array},
    designation : { type : String},
    address : { type : String},
    education : { type : String },
    name_of_course : { type : String },
    year_of_passing : { type : Number },
    date_of_joining : { type : String },
    employment_status : { type : Array},
    
    language_id : [{type:mongoose.Schema.Types.ObjectId, ref:"Languageknow"}],
    address_id : [{type:mongoose.Schema.Types.ObjectId, ref:"Addressproof"}],
    photoproof_id : [{type:mongoose.Schema.Types.ObjectId, ref:"Photoidproof"}],
    resume_name : { type : String },
    resume_title : { type : String },
    notice_period : { type : Number },
    date_of_joining : { type : String },
    current_salary : { type : Number },
    company_name : { type : String },
    experience : { type : Number },
    passport 	: { type : Boolean },
    diploma 	: { type : Boolean },
    selected_by_users : { 
        type: Array ,
        default : []
    },   
	status 	: { 
        type : Number,
        default : 1 
    },
    deleted_at	: { 
        type : Number,
        default : 0
    },  
    parent_id	: {
        type : Object,
        default : null
    }, 
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
