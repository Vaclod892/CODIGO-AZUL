const pool = require('../conexion'); // requerido para establecer conexiones con la base de datos
const bcrypt = require('bcryptjs'); // requerido para encriptar y validar contraseñas
const jwt = require('jsonwebtoken'); // Requerido para utilizar json web tokens
require('dotenv').config(); // Requerido para utilizar variables de entorno

// Este controlador provee funciones relacionadas con la autenticación y autorización de los usuarios


// Autentica a los usuarios y crea un JWT para autorizar futuras interacciones
const iniciarSesion = async (req, res) => {
    const { nombre, contraseña } = req.body;
    console.log(req.body);
    if(!nombre || !contraseña) {
        return res.status(400).json({ "mensaje": "No se han provisto los datos necesarios"});
    }
    // Crea una conexión con la base de datos
    pool.getConnection((err, conexion) => {
        if (err) {
            return res.status(500).json({ "mensaje": "Hubo un fallo en la conexión" });
        }
        console.log(`Conectado con id: ${conexion.threadId}`);
        
        // Busca al usuario en la base de datos
        conexion.query(`SELECT * from usuarios WHERE nombre_usuario = "${nombre}";`, (err, rows) => {
            conexion.release();
            if(!err) {
                if (rows.length > 0) {
                    const { nombre_usuario, contraseña: contraseña_usuario, rol } = rows[0];

                    // Verifica la contraseña
                    setTimeout(async () => {
                        const igualdad = await bcrypt.compare(contraseña, contraseña_usuario);
                        if(igualdad) {
                            // Se generan los tokens de acceso y actualización
                            const tokenAcceso = jwt.sign(
                                { "info_usuario": {
                                    "nombre_usuario": nombre_usuario,
                                    "rol": rol
                                    }
                                },
                                process.env.SECRETO_TOKEN_ACCESO,
                                { expiresIn: '15m' }
                             );
                            const tokenActualizacion = jwt.sign(
                                { "info_usuario": {
                                    "nombre_usuario": nombre_usuario,
                                    "rol": rol
                                    }
                                },
                                process.env.SECRETO_TOKEN_ACTUALIZACION,
                                { expiresIn: '1d' }
                             )

                             // Guarda el token de actualización en la base de datos
                             pool.getConnection((err, conexion) => {
                                if (err) {
                                    return res.status(500).json({ "mensaje": "Hubo un fallo en la conexión" });
                                }
                                console.log(`Conectado con id: ${conexion.threadId}`);
                                conexion.query(`UPDATE usuarios SET tokenActualizacion = "${tokenActualizacion}" WHERE nombre_usuario = "${nombre_usuario}";`, (err, rows) => {
                                    conexion.release();
                                    if(!err) {
                                        console.log("Token de actualización almacenado exitosamente");
                                    } else {
                                        console.log("Error almacenando el token de actualización");
                                    }
                                });
                             });
                             // Crea un cookie httpOnly para almacenar el token de actualización
                             res.cookie('jwt', tokenActualizacion, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                             // Devuelve el token de acceso y el rol del usuario
                             res.status(200).json({ rol, tokenAcceso });
                             res.end();
                        } else {
                            return res.status(401).json({ "mensaje": "La contraseña es incorrecta"});
                        }
                    }, 0);
                } else {

                    return res.status(401).json({"mensaje": "El usuario no existe"});
                }
            } else {
                return res.status(500).json({ "mensaje": `La operación ha fallado: ${err}` });
            }
        });
    })
};

// Genera nuevos tokens de acceso
const actualizarToken = (req, res) => {
    const cookies = req.cookies;
    // Si no existe la cookie que almacena el token de actualización, se bloquea la operación.
    if(!cookies?.jwt) return res.status(401).json({ "mensaje": "No existe el token de actualización" });
    const tokenActualizacion = cookies.jwt;

    pool.getConnection((err, conexion) => {
        if (err) return res.status(500).json({ "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);
        
        conexion.query(`SELECT * from usuarios WHERE tokenActualizacion = "${tokenActualizacion}";`, (err, rows) => {
            conexion.release();
            if(!err) {
                if (rows.length > 0) {
                    const { nombre_usuario } = rows[0];

                    // Verificar la integridad del token de actualización
                    jwt.verify(
                        tokenActualizacion,
                        process.env.SECRETO_TOKEN_ACTUALIZACION,
                        (err, decoded) => {
                            if(err || nombre_usuario !== decoded.info_usuario.nombre_usuario) return console.log(decoded.nombre_usuario);
                            const rol = decoded.info_usuario.rol;
                            const tokenAcceso = jwt.sign(
                                { "info_usuario": {
                                    "nombre_usuario": decoded.info_usuario.nombre_usuario,
                                    "rol": rol
                                    }
                                },
                                process.env.SECRETO_TOKEN_ACCESO,
                                { expiresIn: '15m' }
                            );
                            return res.status(200).json({ rol, tokenAcceso });
                        }
                    )
                } else {
                    return res.status(403).json({ "mensaje": "El token de actualización es inválido" });
                }
            } else {
                return res.status(500).json({ "mensaje": `La operación ha fallado: ${err}` });
            }
        });
    })
};

// Elimina el token de actualización, impidiendo el acceso hasta un nuevo inicio de sesión
const cerrarSesion = (req, res) => {
    const cookies = req.cookies;
    // Si no existe la cookie que almacena el token de actualización, finaliza la operación.
    if(!cookies?.jwt) return res.status(204).json({ "mensaje": "La operación ha finalizado exitosamente" });
    const tokenActualizacion = cookies.jwt;

    pool.getConnection((err, conexion) => {
        if (err) return res.status(500).json({ "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        // Se elimina el token de actualización de la base de datos
        conexion.query(`UPDATE usuarios SET tokenActualizacion = ${null} WHERE tokenActualizacion = "${tokenActualizacion}";`, (err, rows) => {
            conexion.release();
            if(err) {
                console.log(`La operación ha fallado ${err}`);
            } else {
                console.log("Token de actualización eliminado exitosamente");
            }
        })
    })
    // Se elimina la cookie que contiene el token de actualización
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ "mensaje": "Token de actualización eliminado exitosamente" });
};

module.exports = { 
    iniciarSesion,
    actualizarToken,
    cerrarSesion
};