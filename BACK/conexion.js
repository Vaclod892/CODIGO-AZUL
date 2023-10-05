const mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'codigo_azul'
});

module.exports = pool;