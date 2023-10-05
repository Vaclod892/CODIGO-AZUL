const zonasControlador = require('../../controladores/zonasControlador');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(zonasControlador.obtenerZonas)
    .post(zonasControlador.crearZona)

module.exports = enrutador;