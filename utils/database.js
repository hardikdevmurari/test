const Sequelize  = require('sequelize');
const sequelize  = new Sequelize(
    'buyj513yr9hm9rm076vb',
    'u76ypadea0mjrzz9',
    'u76ypadea0mjrzz9',
    {
        dialect : 'mysql',
        host: 'buyj513yr9hm9rm076vb-mysql.services.clever-cloud.com',
    }
);

module.exports = sequelize