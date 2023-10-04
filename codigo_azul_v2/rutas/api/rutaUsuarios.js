const usuariosControlador = require('../../controladores/usuariosControlador');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(usuariosControlador.obtenerUsuarios)
    .post(usuariosControlador.crearUsuario)
    .put(usuariosControlador.modificarRol)
    .delete(usuariosControlador.eliminarUsuario);

module.exports = enrutador;