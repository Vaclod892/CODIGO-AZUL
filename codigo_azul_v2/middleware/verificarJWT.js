const jwt = require('jsonwebtoken'); // Requerido para utilizar json web tokens
require('dotenv').config(); // Requerido para utilizar variables de entorno

// Verifica la integridad del token de acceso
const verificarJWT = (req, res, next) => {
    const headerAutorizacion = req.headers.authorization || req.headers.Authorization;
    if(!headerAutorizacion?.startsWith('Bearer ')) return res.status(401).json({ "mensaje": "Acceso denegado"});
    const token = headerAutorizacion.split(' ')[1];
    console.log(token);
    jwt.verify(
        token,
        process.env.SECRETO_TOKEN_ACCESO,
        (err, decoded) => {
            if (err) return res.json({ "status": 403, "mensaje": "Token inválido"});
            req.nombre_usuario = decoded.info_usuario.nombre_usuario;
            req.rol = decoded.info_usuario.rol;
            next();
        }
    )
};

module.exports = verificarJWT;