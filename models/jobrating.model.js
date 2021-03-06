const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var JobratingSchema = new Schema({
    user_id : { type : mongoose.Schema.Types.ObjectId, ref : "user"},
    job_id :  { type : mongoose.Schema.Types.ObjectId, ref : "job"},
    rating:{ type : Number},
    comment:{ type : String },
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

module.exports = mongoose.model('Jobrating', JobratingSchema);
