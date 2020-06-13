'use strict';

// Importing Environment Variables
require('dotenv').config();

const createConnection = require('../config/connection');
const jobTypeModel = require('../models/jobtypes.model');
const jobType =[
  {name:'Full time jobs', code:'FULL_TIME_JOBS'},
  {name:'Part time jobs', code:'PART_TIME_JOBS'},
  {name:'Work From Home', code:'WORK_FROM_HOME'},
  {name:'Internship', code:'INTERNSHIP'},
  {name:'Work Abroad', code:'WORK_ABROAD'},
]
return new Promise((resolve, reject) => {
  jobTypeModel.find().exec(function(err,data){
      if (err) {
          console.error('Error while inserting the barCodes', err);
          process.exit();
        }

        if (data.length === jobType.length) {
          console.log('Job Type default data already added!!');
          process.exit();
        }
         jobTypeModel.deleteMany({});
        resolve();
  })
}).then(()=>{
    return jobTypeModel.insertMany(jobType);
})
.then(() => {
    console.log('Job type default data has been successfully added!!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error while inserting the barCodes', error);
    process.exit();
  });