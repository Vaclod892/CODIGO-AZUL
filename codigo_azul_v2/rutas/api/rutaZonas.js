const zonasControlador = require('../../controladores/zonasControlador');
const verificarRol = require('../../middleware/verificarRol');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(zonasControlador.obtenerZonas)
    .post(verificarRol, zonasControlador.crearZona) // Solo administradores

module.exports = enrutador;