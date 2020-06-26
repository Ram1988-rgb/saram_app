const jwt = require('jsonwebtoken');
const constant = require('../config/constant');

  async function validateToken(req, res, next){
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {		
      const token = authorizationHeaader;
      try {
        result = jwt.verify(token, constant.JWT_SECRET);
        console.log(result);
        if(result && result.data && result.data._id){
         req.USERID =result.data._id;
          next();
        }else{
          result = { 
            error: `Authentication error. Invalid token.`,
            status: 401 
          };
          res.status(401).send(result);
        }
      } catch (err) {
         //throw new Error(err);
        result = { 
          error: `Authentication error. Invalid token.`,
          status: 401 
		    };
		    res.status(401).send(result);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401 
      };
      res.status(401).send(result);
    }
  }

  async function generate_token(data){
    const payload = { data : data, exp : Math.floor(Date.now() / 1000) + (60 * 60 * 24)};
    const secret = constant.JWT_SECRET;
    const token = jwt.sign(payload, secret);
    return token;
  }

  module.exports = {
    validateToken,
    generate_token
  }
