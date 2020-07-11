'use strict';
const nodemailer = require('nodemailer');

async function sendEmail(data){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: process.env.GMAIL,
               pass: process.env.PASSWORD
           }
       })
       const mailOptions = {
        from: process.env.FROMEMAIL, // sender address
        to: process.env.TO_EMAIL,// data.TO_EMAIL, // list of receivers
        subject: data.subject, // Subject line
        html: data.message// plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if(err){
            console.log(err);
        }else{
         return info;
        }
     });
}

async function createEmailData(jobData){
    const message = `<h3>${jobData.name} has some abbusive words. Please check </h3>`;
    sendEmail({
        message:message,
        subject:"Abusive Words",
        toemail:process.env.gmail
    })
}
module.exports = {
	sendEmail,
	createEmailData
}
