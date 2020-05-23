const {user} = require('../../../models/index.model');
const async = require('async');
const dateFormat = require('date-fns/format');
const mongoose = require('mongoose')
const vendorController = {

    requests : async (req,res)=>{
        res.render('admin/vendor/vendorRequest.ejs',{layout:'admin/layout/layout'} );

        },
    
    requestData : (req,res)=>{

        let perPage = parseInt(req.input('length'));
        let pageNo = parseInt(req.input('start'))+1;
        let andArray = [{
            "deleted_at" : 0,
            "vendor.approval" : 1,
            "vendor.status" : 0
        }]
        let search = req.input('search')['value'].length >0?req.input('search')['value']:null;
        
        let searchCondition = null;
        if(search != null){
            searchCondition= {$or : [
                 {
                     name : { 
                        $regex: '.*' + search + '.*',$options:'i' 
                     }
                 },
                 {
                    email : { 
                        $regex: '.*' + search + '.*',$options:'i' 
                     }
                 },
                 {
                    mobile : { 
                        $regex: '.*' + search + '.*',$options:'i' 
                     }
                 },
                 {
                    'vendor.organisation' : { 
                        $regex: '.*' + search + '.*',$options:'i' 
                     }
                 }
             ] }  
             
             andArray.push(searchCondition);

        }

        let query = {
            $and : andArray
        }

        let limit = perPage;
        let skip = (pageNo > 0)?((pageNo-1)*perPage):0;
        
        let columns = req.input('columns');
        let order = req.input('order');
        let orderby = {}
       order.map((ordr)=>{
           var key = columns[ordr.column].name.toString();
           Object.assign(orderby,{[key]:ordr.dir=='desc'?-1:1})
       })

        const usersData = new Promise((resolve,reject)=>{
            
            
            
            user.find(query).skip(skip).limit(limit).sort(orderby).exec((err,users)=>{

                    if(err){
                       
                        reject(err);
                    }else{
                       
                        resolve(users)
                    }

                })

        })

        const userCount = new Promise((resolve,reject)=>{

            user.find(query).count().exec((err,countData)=>{

                if(err){
                   
                    reject(err);
                }else{
                   
                    resolve(countData)
                }

            })

        })

        Promise.all([usersData,userCount]).then((result)=>{

           let responseData =  {
                "draw": parseInt(req.input('draw')),
                "recordsTotal": result[1],
                "recordsFiltered": result[1]
            }

            responseData.data = vendorController.dataTable(result[0],(err,response)=>{
                
                if(err){
                    res.send(err)
                }else{
                    responseData.data = response;
                    res.send(responseData)
                }

            })

        }).catch(err=>{
           
            res.send(err)
        })

    },
    
    dataTable : (fetchData,callback)=>{

        var returnRespone = [];
        if(fetchData.length > 0){
            
            async.eachSeries(fetchData,(user,cb)=>{
                var arr = [];
                arr.push("<input name='action_check[]' class='all_check' type='checkbox' value ='"+user._id+"' >");
                arr.push(user.name);
                arr.push(user.email);
                arr.push(user.mobile);
                arr.push(user.vendor.organisation);
                arr.push(dateFormat(user.vendor.request_date,'yyyy-MM-dd'));
                arr.push('<a data-userid = "'+user._id+'" class="approve_to_vendor" href="javascript:void(0);" >Approve</a>')
                returnRespone.push(arr);  
                cb();  
                })
           callback(null,returnRespone)

        }else{
            callback(null,returnRespone)
        }

    },

    approve : (req,res)=>{

       
       try {
        var userid = req.input('userid')
        if(userid){

            user.findOne({_id:userid,deleted_at:0,'vendor.approval':1}).exec((error,userData)=>{

                if(userData._id == userid){

                    user.updateOne({_id:userid,deleted_at:0,'vendor.approval':1},{'vendor.status':1,'vendor.approval':2}).exec((err,updateResponse)=>{

                        if(updateResponse.nModified == 1){
                            res.send({success : 'approved'})    
                        }
                        else{
                            res.send({success : 'fail'})
                        }
                        

                    })

                }else{

                    let err = null;
                    if(error){
                        err = error;
                    }else{
                        err = "Data not Found"
                    }
                    throw new Error(err);

                }

            })

        }

       } catch (error) {

           res.send({error:error})
       }

    },

    list : (req,res)=>{
        
        res.render('admin/vendor/vendorList.ejs',{layout:'admin/layout/layout'} );

    },
    approveAll : (req,res)=>{

        let approvalId = req.input('action_check');

        if(approvalId.length > 0){


            var bulkUpdate = user.collection.initializeUnorderedBulkOp();
             async.mapSeries(approvalId, function(item, cb) {

                bulkUpdate.find({_id:mongoose.Types.ObjectId(item),deleted_at:0,'vendor.approval':1}).update({$set : {'vendor.status':1,'vendor.approval':2}});                
                cb();
               
            }, function(result){
                bulkUpdate.execute((err,bulkResponse)=>{
                    res.send('success')
    
                })
            });

            //res.send('failure')

        }else{
            res.send('failure')
        }

    }

    
    
}
module.exports = vendorController;
