const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LanguageknowSchema = new Schema({
    name: {type: String},
    lng_code:{type: String},
    status:{type:Boolean},  
    deleted_at:{type:Number}, 
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
module.exports = mongoose.model('Languageknow', LanguageknowSchema);