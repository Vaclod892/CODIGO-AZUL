const profesionalesControlador = require('../../controladores/profesionalesControlador');
const verificarRol = require('../../middleware/verificarRol');
const enrutador = require('express').Router();

enrutador.route('/')
    .get(profesionalesControlador.obtenerProfesionales)
    .post(verificarRol, profesionalesControlador.cargarProfesional) // Solo administradores
    .put(verificarRol, profesionalesControlador.bajaProfesional); // Solo administradores

module.exports = enrutador;