const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var JobSchema = new Schema({
	category_id : [{type:mongoose.Schema.Types.ObjectId, ref:"category"}],
	name : { type: String },
	description : { type : String },
    createdby : { type : String },
	status 	: { type : Boolean },
    deleted_at	: { type : Number},  
    start_time	: { type : Date }, 
    end_time	: { type : Date }, 
    createdAt	: {
        type : Date,
        default : Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }  
})

module.exports = mongoose.model('job', JobSchema);
