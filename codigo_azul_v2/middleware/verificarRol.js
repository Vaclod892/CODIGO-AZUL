// Se verifica si el usuario tiene permisos de administrador
const verificarRol = (req, res, next) => {
    if (!req?.rol) return res.json({ "status": 401, "mensaje": "Acceso Denegado" });
    const permiso = req.rol === "admin";
    if (!permiso) return res.json({ "status": 401, "mensaje": "Acceso Denegado" });
    next();
}

module.exports = verificarRol;