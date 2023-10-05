const profesionalesControlador = require('../../controladores/profesionalesControlador');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(profesionalesControlador.obtenerProfesionales)
    .post(profesionalesControlador.crearProfesional)
    .put(profesionalesControlador.bajaProfesional);

module.exports = enrutador;