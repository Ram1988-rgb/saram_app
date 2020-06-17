const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	name : { type: String, required : true},
	email : { type : String },
	mobile : { type : Number },
	password	: { type : String },
    createdby : { type : String },
    gender : { type : String },
    dob : { type : String },
    photo_type_id : { type : Object },
    photo_id_number : { type : String },
    photo_proof : { type : String },
    image : { type : String },
	status 	: { 
        type : Number,
        default : 1 
    },
    deleted_at	: { 
        type : Number,
        default : 0
    },   
     seeker: {
        type : Number,
        default : 0
    },
     provider : {
        type : Number,
        default : 1
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

module.exports = mongoose.model('User', UserSchema);
