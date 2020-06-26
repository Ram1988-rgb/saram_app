const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var DeviceSchema = new Schema({
	device_id 	: { type: String },
	device_token : { type : String },
	type : { type : String },
	status 	: { 
        type : Number,
        default : 1 
    },
    deleted_at	: { 
        type : Number,
        default : 0
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

module.exports = mongoose.model('Device', DeviceSchema);
