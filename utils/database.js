const Sequelize  = require('sequelize');
const sequelize  = new Sequelize(
    'web',
    'root',
    '',
    {
        dialect : 'mysql',
        host: 'localhost',
    }
);

module.exports = sequelize