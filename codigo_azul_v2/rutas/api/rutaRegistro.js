const registroControlador = require('../../controladores/registroControlador');
const enrutador = require('express').Router();

enrutador.route('/')
    .post(registroControlador.registro)

module.exports = enrutador;