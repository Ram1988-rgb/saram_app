'use strict';

// Importing Environment Variables
require('dotenv').config();

const createConnection = require('../config/connection');
const lKnownModel = require('../models/languageknow.model');
const lKnown =[
	{
		name : "English"
	},
	{
		name : "Hindi"
	},
	{
		name : "Tamil"
	},
	{
		name : "Telugu"
	},
	{
		name : "Kannada"
	},
	{
		name : "Malayalam"
	},
	{
		name : "Matathi"
	},
	{
		name : "Nepali"
	},
	{
		name : "Sanskrit"
	},
	{
		name : "Odia"
	},
	{
		name : "Punjabi"
	},
	{
		name : "Nepali"
	},
	{
		name : "Other"
	}	
];

return new Promise((resolve, reject) => {
  lKnownModel.find().exec(function(err,data){
      if (err) {
          console.error('Error while inserting the barCodes', err);
          process.exit();
        }

        if (data.length === lKnown.length) {
          console.log('language  default data already added!!');
          process.exit();
        }
        lKnownModel.deleteMany({});
        resolve();
  })
}).then(()=>{
    return lKnownModel.insertMany(lKnown);
})
.then(() => {
    console.log('language default data has been successfully added!!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error while inserting the barCodes', error);
    process.exit();
  });