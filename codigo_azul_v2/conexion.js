const mysql = require('mysql'); // Permite establecer conexiones y consultar una base de datos
require('dotenv').config(); // Requerido para utilizar variables de entorno

let pool = mysql.createPool({
    connectionLimit: 10,
    host     : process.env.BD_SERVIDOR,
    user     : process.env.BD_USUARIO,
    password : process.env.BD_CLAVE,
    database : process.env.BD
});

module.exports = pool;