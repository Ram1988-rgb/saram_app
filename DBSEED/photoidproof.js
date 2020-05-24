'use strict';

// Importing Environment Variables
require('dotenv').config();

const createConnection = require('../config/connection');
const pIdProofModel = require('../models/photoidproof.model');
const pId =[
	{
		name : "Aadhaar Card"
	},
	{
		name : "Passport"
	},
	{
		name : "Ration Card"
	},
	{
		name : "Driving License"
	},
	{
		name : "Voter ID Card"
	}
]

return new Promise((resolve, reject) => {
  pIdProofModel.find().exec(function(err,data){
      if (err) {
          console.error('Error while inserting the barCodes', err);
          process.exit();
        }

        if (data.length === pId.length) {
          console.log('Photo Id Proof default data already added!!');
          process.exit();
        }
        pIdProofModel.deleteMany({});
        resolve();
  })
}).then(()=>{
    return pIdProofModel.insertMany(pId);
})
.then(() => {
    console.log('Photo Id Proof default data has been successfully added!!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error while inserting the barCodes', error);
    process.exit();
  });