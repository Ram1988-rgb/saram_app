const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let applyjobSchema = new Schema({
    status:{
        type: Boolean,
        default : true
    },
    job_id : {type:mongoose.Schema.Types.ObjectId,ref:'job'},
    user_id : {type:mongoose.Schema.Types.ObjectId,ref:'user'},
    deleted_at : { 
        type : Number,
        default : 0 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model
module.exports = mongoose.model('Applyjob', applyjobSchema);


