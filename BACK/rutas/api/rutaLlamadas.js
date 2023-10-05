const llamadasControlador = require('../../controladores/llamadasControlador');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(llamadasControlador.obtenerLlamadas)
    .post(llamadasControlador.crearLlamada)
    .put(llamadasControlador.modificarLlamada)

module.exports = enrutador;