const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	name : { type: String, required : true},
	email : { type : String },
	mobile : { type : Number },
	password	: { type : String },
    createdby : { type : String },
	status 	: { type : Boolean },
    deleted_at	: { type : Number},   
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
