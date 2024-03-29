const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sortlisted_candidateSchema = new Schema({
    status	:{ 
		type: Boolean,
		default : true
	},
    profile_id 	: {type:mongoose.Schema.Types.ObjectId, ref:"userprofiles"},
    user_id 	: {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    profile_user_id 	: {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    deleted_at	:{
		type : Number,
		default : 0
	},
    createdAt	: {
        type: Date,
        default: Date.now
    },
    updatedAt	: {
        type: Date,
        default: Date.now
    }
});

// Export the model
module.exports = mongoose.model('Sortlisted_candidate', sortlisted_candidateSchema);


