const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StaticpagesSchema = new Schema({
    title : {type: String, required: true},
    meta_title : { type : String },
    description : { type : String },
    status:{type: Boolean},
    deleted_at:{type: Number},
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
module.exports = mongoose.model('Staticpages', StaticpagesSchema);