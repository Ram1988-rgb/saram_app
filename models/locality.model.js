const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let localitySchema = new Schema({
    name: {type: String},
    status:{type: Boolean},
    country_id : {type:mongoose.Schema.Types.ObjectId,ref:'country'},
    city_id : {type:mongoose.Schema.Types.ObjectId,ref:'city'},
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
module.exports = mongoose.model('Locality', localitySchema);


