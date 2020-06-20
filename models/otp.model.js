const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OtpSchema = new Schema({
    mobile:{ type : Number },
    otp:{type:Number},
    code:{type:String,default:"+91"},
    purpose:{type:String},
    deleted_at	: { type : Number, default : 0 },
    createdAt	: {
        type : Date,
        default : Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    } 

})

module.exports = mongoose.model('otp', OtpSchema);