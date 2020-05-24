'use strict';

// Importing Environment Variables
require('dotenv').config();

const createConnection = require('../config/connection');
const apModel = require('../models/addressproof.model');
const ap =[
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
		name : "PAN Card"
	},
	{
		name : "Voter ID Card"
	},
	{
		name : "Electricity Bill"
	},
	{
		name : "Registered Rental Agreement"
	},
	{
		name : "Registered Sale Deed / Agreement"
	}
]

return new Promise((resolve, reject) => {
  apModel.find().exec(function(err,data){
      if (err) {
          console.error('Error while inserting the barCodes', err);
          process.exit();
        }

        if (data.length === ap.length) {
          console.log('Address Proof default data already added!!');
          process.exit();
        }
        apModel.deleteMany({});
        resolve();
  })
}).then(()=>{
    return apModel.insertMany(ap);
})
.then(() => {
    console.log('Address Proof default data has been successfully added!!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error while inserting the barCodes', error);
    process.exit();
  });