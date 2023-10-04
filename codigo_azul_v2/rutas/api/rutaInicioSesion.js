const sesionControlador = require('../../controladores/sesionControlador');
const enrutador = require('express').Router();

enrutador.post('/', sesionControlador.iniciarSesion);

module.exports = enrutador;