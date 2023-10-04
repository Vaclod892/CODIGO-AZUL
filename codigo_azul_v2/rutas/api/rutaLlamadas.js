const llamadasControlador = require('../../controladores/llamadasControlador');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(llamadasControlador.obtenerLlamadas)
    .post(llamadasControlador.emitirLlamada)
    .put(llamadasControlador.atenderLlamada);

enrutador.route('/terminar')
    .put(llamadasControlador.terminarLlamada);

module.exports = enrutador;