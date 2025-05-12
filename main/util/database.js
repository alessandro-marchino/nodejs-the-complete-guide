const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'node-complete',
    user: 'nodejscomplete',
    password: 'mypass'
});

module.exports = pool.promise();
