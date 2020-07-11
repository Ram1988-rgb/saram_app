var SITEURL = process.env.SITEURL;
var ABSOLUTEPATH = process.env.ABSOLUTEPATH;
module.exports = {
	//SMSWORKING_KEY:"A3e2121b3b63fca4a65717031db6cdf67",
	SMSWORKING_KEY:"Aaf4fde399017f09f7d454240ac76c466",
	//SENDER_CODE:"CICDMO",
	//SENDER_CODE:"PRIRTY",
	SENDER_CODE:"SRMAPP",
	SMS_URL :"http://alerts.prioritysms.com/api/web2sms.php",
	OTPVALIDITY:10,
	
	SITEURL : process.env.SITEURL+":"+process.env.PORT,
	ADMINSITEURL:SITEURL+'admin/',
	USERSITEURL:SITEURL+'user/',
	SHOWLANGUAGEPATH:SITEURL+'assets/files/languages/',	

	UPLOADPAGEIMAGE:ABSOLUTEPATH+'public/assets/files/pageimages/',
	UPLOADPAGEIMAGEURL:SITEURL+'assets/files/pageimages/',	


	SAMPLEEXPORTUSERCSVURL:SITEURL+'assets/files/sample/user/',
	//BUSINESS_FIELD:[]
	JWT_SECRET 	: 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes',
	TIMEZONE:process.env.TIMEZONE,
	FORMATETIME:'DD-MM-YYYY hh:mm A',
	//new sram_app

	UPLOAD_USER_PHOTOID:`${ABSOLUTEPATH}/public/assets/files/photoid/`,
	SHOW_USER_PHOTOID:`${SITEURL}assets/files/photoid/`,

	UPLOAD_USER_PROFILE:`${ABSOLUTEPATH}/public/assets/files/userimage/`,
	SHOW_USER_PROFILE:`${SITEURL}assets/files/userimage/`,

	//resume
	UPLOAD_USER_RESUME:`${ABSOLUTEPATH}/public/assets/files/userresume/`,
	SHOW_USER_RESUME:`${SITEURL}assets/files/userresume/`,

	//skill exp 
	UPLOAD_SKILL_EXP:`${ABSOLUTEPATH}/public/assets/files/skillexp/`,
	SHOW_SKILL_EXP:`${SITEURL}assets/files/skillexp/`,

	



}
