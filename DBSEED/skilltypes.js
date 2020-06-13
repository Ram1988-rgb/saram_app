'use strict';

// Importing Environment Variables
require('dotenv').config();

const createConnection = require('../config/connection');
const skilltypesModel = require('../models/skilltypes.model');
const skillTypes =[
  {name:'Skill', code:'SKILL', status : true, deleted_at : 0},
  {name:'Expertise', code:'EXPERTISE', status : true, deleted_at : 0},
]
return new Promise((resolve, reject) => {
  skilltypesModel.find().exec(function(err,data){
      if (err) {
          console.error('Error while inserting the barCodes', err);
          process.exit();
        }

        if (data.length === skillTypes.length) {
          console.log('Job Type default data already added!!');
          process.exit();
        }
         skilltypesModel.deleteMany({});
        resolve();
  })
}).then(()=>{
    return skilltypesModel.insertMany(skillTypes);
})
.then(() => {
    console.log('Job type default data has been successfully added!!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error while inserting the barCodes', error);
    process.exit();
  });
