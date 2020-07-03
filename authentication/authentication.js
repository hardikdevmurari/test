//var conn = require('./database.js');
var express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { response } = require('express');



var app = express();


module.exports = {

 authentication :  (req ,res , next) => {
    console.log("in admin authentication method");
    

    var decodedtoken = jwt.decode(req.headers.token );
  
  //  console.log(decodedtoken);
    if(decodedtoken.role == "SUPERADMIN"  ){
      console.log("authenticated");
      next();
    }
    else{
      res.json({'status':'False', 'number':'30' , 'message':'This is authorized to only super admin'});   
    }
   
  
  },
  abcd :  (req ,res , next) => {
    console.log("in user authentication method");
 
    next();
  
  }

}


