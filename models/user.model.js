const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {type: String, required: true},
	email:{type:String},
	mobile:{type:String},
	password:{type:String},
    createdby:{type:String},
	aggre:{type:Boolean},
	status:{type: Boolean},
    deleted_at:{type: Number},
    vendor : {
        
        status : {
            type: Number,
            default : 0 // 0 => normal user, 1=> vendor,
        },
        organisation : {
            type:String,
            default : null
        },
        bestTime : {
            type: String,
            default: null
        },
        request_date : {
            type: Date,
            default: Date.now
        },
        approval : {
            type : Number,
            default : 0 // 0 => Not-requested, Requested => 1 ,2 => Approved,
        }

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }  
})

module.exports = mongoose.model('User', UserSchema);