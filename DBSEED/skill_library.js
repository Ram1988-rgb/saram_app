'use strict';

// Importing Environment Variables
require('dotenv').config();

const createConnection = require('../config/connection');
const skillLibraryModel = require('../models/skill_library.model');
const skillLibrary =[
  {name:'C', code:'SKILL', status : true, deleted_at : 0},
  {name:'C++', code:'SKILL', status : true, deleted_at : 0},
  {name:'Java', code:'SKILL', status : true, deleted_at : 0},
  {name:'NodeJS', code:'SKILL', status : true, deleted_at : 0},
  {name:'Design', code:'EXPERTISE', status : true, deleted_at : 0},
  {name:'Welder', code:'EXPERTISE', status : true, deleted_at : 0},
  {name:'Rajgir', code:'EXPERTISE', status : true, deleted_at : 0},
]
return new Promise((resolve, reject) => {
  skillLibraryModel.find().exec(function(err,data){
      if (err) {
          console.error('Error while inserting the barCodes', err);
          process.exit();
        }

        if (data.length === skillLibrary.length) {
          console.log('Skill library default data already added!!');
          process.exit();
        }
         skillLibraryModel.deleteMany({});
        resolve();
  })
}).then(()=>{
    return skillLibraryModel.insertMany(skillLibrary);
})
.then(() => {
    console.log('Skill library default data has been successfully added!!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error while inserting the barCodes', error);
    process.exit();
  });
