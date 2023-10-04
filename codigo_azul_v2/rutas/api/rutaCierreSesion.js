const sesionControlador = require('../../controladores/sesionControlador');
const enrutador = require('express').Router();

enrutador.get("/", sesionControlador.cerrarSesion);

module.exports = enrutador;