//database
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/sram_app';
//var mongoDB = 'mongodb+srv://admin:admin@cluster0-0mfh0.mongodb.net/sram_app?retryWrites=true&w=majority';
mongoose.connect(mongoDB, () => { }, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {
        console.log(err);
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = db
