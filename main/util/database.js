const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('node-complete', 'nodejscomplete', 'mypass', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false
});
module.exports = sequelize;
