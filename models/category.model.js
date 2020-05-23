const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
    name: {type: String},
    code:{type:String},
    description:{type: String},
    image:{type: String},
    status:{type: Boolean},
    cat_id:{type:mongoose.Schema.Types.ObjectId},
    child:{type:Number, default:0},
    level:{type:Number},
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
module.exports = mongoose.model('Category', CategorySchema);
