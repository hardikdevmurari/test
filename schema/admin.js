// Include Sequelize module. 
const Sequelize = require('sequelize') 

 
const sequelize = require('../utils/database') 

// Define method takes two arrguments 
// 1st - name of table 
// 2nd - columns inside the table 
const User = sequelize.define('admin', { 

	// Column-1, user_id is an object with 
	// properties like type, keys, 
	// validation of column. 
	id:{ 

		// Sequelize module has INTEGER Data_Type. 
		type:Sequelize.INTEGER, 

		// To increment user_id automatically. 
		autoIncrement:true, 

		// user_id can not be null. 
		allowNull:false, 

		// For uniquely identify user. 
		primaryKey:true
	}, 

	// Column-2, name 
	emailaddress: { type: Sequelize.STRING, allowNull:false }, 

	// Column-3, email 
	name: { type: Sequelize.STRING, allowNull:true }, 
	password: { type: Sequelize.STRING, allowNull:true },
	role :{ type : Sequelize.ENUM,   values: ['ADMIN', 'SUPERADMIN', 'USER'],   allowNull:true},
	token : { type: Sequelize.STRING, allowNull:true },
	otherInfo : { type: Sequelize.STRING, allowNull:true },
	profilepic : { type: Sequelize.STRING, allowNull:true },
	// Column-4, default values for 
	// dates => current time 
/* 	myDate: { type: Sequelize.DATE, 
			defaultValue: Sequelize.NOW },  */

	// Timestamps 
	createdAt: Sequelize.DATE, 
	updatedAt: Sequelize.DATE, 
	LastLoginAt: Sequelize.DATE, 
}
,
{
	freezeTableName: true
}) 

// Exporting User, using this constant 
// we can perform CRUD operations on 
// 'user' table. 
module.exports = User
