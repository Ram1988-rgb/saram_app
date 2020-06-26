const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var JobSchema = new Schema({
    subcategory_id : [{type:mongoose.Schema.Types.ObjectId, ref:"category"}],
    category_id : {type:mongoose.Schema.Types.ObjectId, ref:"category"},
    name : { type: String },
    keyword : { type: String },
	jobtype : { type: Array },
	description : { type : String },
	salary_min : { type : Number },
	salary_max : { type : Number },
	exp_min : { type : Number },
	exp_max : { type : Number },
    createdby : { type : Object },
    city_id : { type : Object },
    user_id : { type : Object },
    locality_id : { type : Object },
    company : { type : String },
    company_data : { type: Array },
    apply_users : { 
        type: Array ,
        default : []
    },
	status 	: { 
        type : Number, 
        default : 1
    },
    deleted_at	: { type : Number, default : 0 },  
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

