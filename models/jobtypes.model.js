const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let JobtypesSchema = new Schema({
    name : { type : String},
    code : { type : String},
    status : { type : Boolean},
    deleted_at : { type : Number},
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt: {
        type : Date,
        default : Date.now
    }
});

// Export the model
module.exports = mongoose.model('Jobtypes', JobtypesSchema);



