// Include Sequelize module. 
const Sequelize = require('sequelize') 

 
const sequelize = require('../utils/database') 

// Define method takes two arrguments 
// 1st - name of table 
// 2nd - columns inside the table 
const User = sequelize.define('user', { 

	// Column-1, user_id is an object with 
	// properties like type, keys, 
	// validation of column. 
	user_id:{ 

		
		type:Sequelize.INTEGER, 

		 
		autoIncrement:true, 

		
		allowNull:false, 

		
		primaryKey:true
	}, 

	// Column-2, name 
	name: { type: Sequelize.STRING, allowNull:false }, 

	// Column-3, email 
	email: { type: Sequelize.STRING, allowNull:false }, 

	// Column-4, default values for 
	// dates => current time 
	myDate: { type: Sequelize.DATE, 
			defaultValue: Sequelize.NOW }, 

	// Timestamps 
	createdAt: Sequelize.DATE, 
	updatedAt: Sequelize.DATE, 
}) 

// Exporting User, using this constant 
// we can perform CRUD operations on 
// 'user' table. 
module.exports = User
