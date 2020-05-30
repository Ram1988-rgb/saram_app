var SITEURL = process.env.SITEURL;
var ABSOLUTEPATH = process.env.ABSOLUTEPATH;
module.exports = {
	hello:'how are you',
	twitterauth:{
	  consumer_key: '2nC4MzCrBh3zTu9a3Df84OKPU',
	  consumer_secret: 'FlDDlBi3Xf3KI6lCQlGlvriiyhG5wcusGKmqcqsTZdc7QPLfQY',
	  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAEJA9gAAAAAAfwbPX5%2Fxs88mINzWNvH%2BfRnIVow%3DJrfS6m8f6lEd3KhwwyPv1tbShA6AbU5SgDaOBRuzviRwPbam05'
	},
	SITEURL : process.env.SITEURL+":"+process.env.PORT,
	ADMINSITEURL:SITEURL+'admin/',
	USERSITEURL:SITEURL+'user/',
	SHOWLANGUAGEPATH:SITEURL+'assets/files/languages/',	
	

	UPLOADPAGEIMAGE:ABSOLUTEPATH+'public/assets/files/pageimages/',
	UPLOADPAGEIMAGEURL:SITEURL+'assets/files/pageimages/',
	


	SAMPLEEXPORTBUSINESSCSVURL:SITEURL+'assets/files/sample/bussiness/',

	SAMPLEEXPORTUSERCSVURL:SITEURL+'assets/files/sample/user/',
	//BUSINESS_FIELD:[]
	JWT_SECRET 	: 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes',
	TIMEZONE:process.env.TIMEZONE,
	FORMATETIME:'DD-MM-YYYY hh:mm A',
	//new sram_app

	UPLOAD_USER_PHOTOID:`${ABSOLUTEPATH}/public/file/photoid/`,
	SHOW_USER_PHOTOID:`${SITEURL}file/photoid/`,

	UPLOAD_USER_PROFILE:`${ABSOLUTEPATH}/public/file/userimage/`,
	SHOW_USER_PROFILE:`${SITEURL}file/userimage/`,

	PAYPALAPI:{
    "host": "api.sandbox.paypal.com",
    "port": "",
    "client_id": "AdN7vRe_VY5qpb9_mtv1qECHjnNuwBOaEK4RX5JS2yKPwXWKDraebmjLIQc0qJ_jICT3utJN-HU5RFjD",
    "client_secret": "EG8FP4e8PPW_A-l08SbCdasnHTTq68KClfYXhoH31YdIL-w1tWbmd7O5dQr4oFguJOcX6cQ5ylKFYNgj",
  



}



}
