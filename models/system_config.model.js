const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let System_configSchema = new Schema({
    abuse_key : {type: String, required: true},
    status : 
    {
		type: Boolean,
		default : true
	},
    deleted_at:
    {
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
module.exports = mongoose.model('System_config', System_configSchema);
