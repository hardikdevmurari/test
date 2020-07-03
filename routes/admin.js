const express =  require('express');
var multer = require('multer');

// File upload settings  
const PATH = './upload';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null,  Date.now() +'-' + file.originalname )
  }
});

let upload = multer({
  storage: storage
});



const admin = require('../v1/admin');
const authentication = require('../authentication/authentication');

const router = express.Router();

router.post('/login' , admin.login);
router.post('/insertadmin',authentication.authentication , upload.single('file') ,   admin.insertadmin);
router.post('/updateadmin/:adminid', authentication.authentication  , upload.single('file'), admin.updateadmin);
router.delete('/deleteadmin/:adminid',  admin.deleteadmin);
//router.get('/getadmin' , authentication.authentication , admin.getAllAdmin);
router.post('/getadminpage' , admin.getadmin);


module.exports = router;
