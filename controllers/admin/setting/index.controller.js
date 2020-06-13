const commanHelper = require(`${appRoot}/helpers/comman.helper`)
async function getLocality(req,res){
    const locality = await commanHelper.getlocality(req.body.cityId);
    var loc = '<option value="">Select Location</option>'
    if(locality && locality.length){
        for(let i=0;i< locality.length;i++){
           loc = loc+ `<option value='${locality[i].id}'>${locality[i].name}</option>`
        }
    }
    res.send(loc)
}

module.exports = {
    getLocality
}