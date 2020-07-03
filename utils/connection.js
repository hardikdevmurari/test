var mysql = require("mysql");


var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"web",
    multipleStatements: true
});



con.connect(function(err){
    if(err) throw err
    console.log('connected database ');
});

module.exports = con;


// Import the sequelize object on which 
// we have defined model. 
const sequelize = require('../utils/database') 
  
// Import the user model we have defined 
//const User = require('../schema/user')
const Admin = require('../schema/admin')  
  
// foregin key setting
 /* User.belongsTo(Admin,  {foreignKey: 'ForeignID', as: ' user_id'}) */


// Create all the table defined using  
// sequelize in Database 
  
// Sync all models that are not 
// already in the database 
sequelize.sync();  
  
// Force sync all models 
// It will drop the table first  
// and re-create it afterwards 
 //sequelize.sync({force:true}) 


