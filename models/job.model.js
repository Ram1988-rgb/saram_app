const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var JobSchema = new Schema({
	category_id : [{type:mongoose.Schema.Types.ObjectId, ref:"category"}],
	name : { type: String },
	jobtype : { type: Array },
	description : { type : String },
	salary_min : { type : String },
	salary_max : { type : String },
	exp_min : { type : Number },
	exp_max : { type : Number },
    createdby : { type : Object },
    city_id : { type : {type:mongoose.Schema.Types.ObjectId, ref:"city"} },
    user_id : { type : { type : mongoose.Schema.Types.ObjectId, ref : "user"} },
    locality_id : { type : {type:mongoose.Schema.Types.ObjectId, ref:"locality"} },
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

