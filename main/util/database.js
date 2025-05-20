const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('nome-complete', 'nodejscomplete', 'mypass', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});
module.exports = sequelize;
