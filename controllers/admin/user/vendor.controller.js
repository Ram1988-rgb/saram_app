const {user} = require('../../../models/index.model');
const async = require('async');
//var config = require('../../../config/index');  
const dateFormat = require('date-fns/format');
//var moment = require("moment-timezone");
const vendorController = {

    list : (req,res)=>{

        res.render('admin/vendor/vendorList.ejs',{layout:'admin/layout/layout'} );

    },
    
    listData : (req,res)=>{

        let perPage = parseInt(req.input('length'));
        let pageNo = parseInt(req.input('start'))+1;
        let andArray = [{
            "deleted_at" : 0,
            "vendor.approval" : 2,
            "vendor.status" : 1
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
            
            console.log(query)

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
                arr.push("<input name='vendorlist[]' class='rowCheckBox' type='checkbox' value ='"+user._id+"' >");
                arr.push(user.name);
                arr.push(user.email);
                arr.push(user.mobile);
                arr.push(user.vendor.organisation);
                arr.push(dateFormat(user.vendor.request_date,'yyyy-MM-dd'));
            //    var TIMEZONE = config.constant.TIMEZONE;
            //  var newsdate = moment(user.vendor.request_date).tz(TIMEZONE).format(config.constant.FORMATETIME);
            // arr.push(newsdate);
                arr.push("<a href='view?id="+user._id+"'>Views</a>")
                returnRespone.push(arr);  
                cb();  
                })
           callback(null,returnRespone)

        }else{
            callback(null,returnRespone)
        }

    },
    vendorDetail : (req,res)=>{

    }

    

}
module.exports = vendorController;
