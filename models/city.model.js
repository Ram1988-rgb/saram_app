const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CitySchema = new Schema({
    name: {type: String},
    status:{type: Boolean},
    country_id:{type:mongoose.Schema.Types.ObjectId,ref:'country'},
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
module.exports = mongoose.model('City', CitySchema);


