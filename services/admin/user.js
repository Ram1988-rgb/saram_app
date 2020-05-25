'use strict';

const userModel = require(`${appRoot}/models/user.model`);

async function getProfile(id){
    return await userModel.findOne({_id:id});

}

module.exports = {
    getProfile
}