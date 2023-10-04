const pacientesControlador = require('../../controladores/pacientesControlador');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(pacientesControlador.obtenerPacientes)
    .post(pacientesControlador.cargarPaciente);

module.exports = enrutador;