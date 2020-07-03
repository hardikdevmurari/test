//var conn = require('./database.js');
var express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();

var app = express();


module.exports = {

 insertadmin :  (req ,res) => {
    console.log("in user insert user method");
 
    res.send("hello");
  
  }

}







