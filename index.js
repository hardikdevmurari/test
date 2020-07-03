var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors')
var app = express()

//var connection = require('./connection');


const PORT = process.env.PORT;


app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors())


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept ,  Accept, Accept-Language,  User-Agent"
//   );
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  
//   next();
// });

app.get('/',(req,res)=>{
  console.log('api alled');
  res.send('api is working')
});
// app.use('/v1/admin' , require('./routes/admin'));


const https = http.createServer(app);


https.listen(PORT, function() {
 console.log("Server is running !");
});




