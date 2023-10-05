const pool = require('../conexion');
const app = require('express')();
const bodyParser = require('body-parser');
const { format } = require('date-fns');

const obtenerPacientes = (req, res) => {
    if (req.query.nombres) {
        const nombres = req.query.nombres;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from pacientes WHERE nombres = "${nombres}";`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se ha encontrado al paciente: ${nombres}`);
                    }
                    res.end();
                } else {
                    throw err;
                }
            })
        })
    } else if (req.query.apellidos) {
        const apellidos = req.query.apellidos;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from pacientes WHERE apellidos = "${apellidos};"`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se ha encontrado al paciente: ${apellidos}`);
                    }
                    res.end();
                } else {
                    throw err;
                }
            })
        })
    } else if (req.query.id) {
        const id = parseInt(req.query.id);
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from pacientes WHERE id = ${id};`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`El paciente con el id ${id} no existe`);
                    }
                    res.end();
                } else {
                    throw err;
                }
            })
        })
    } else {
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);
    
            conexion.query('SELECT * from pacientes', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.send(rows);
                        console.log(rows);
                    } else {
                        res.send('No se han encontrado pacientes');
                    }
                    res.end();
                } else {
                    throw err;
                }
            });
        });
    }
};

const crearPaciente = (req, res) => {
    console.log(req.body);

    // datos del paciente nuevo
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const sexo = req.body.sexo;
    const tipo_sangre = req.body.tipo_sangre;
    const dni = req.body.dni;

    pool.getConnection((err, conexion) => {
        if(err) throw err;
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO pacientes (fecha_nacimiento, nombres, apellidos, sexo, tipo_sangre, dni) VALUES ("${fecha_nacimiento}", "${nombres}", "${apellidos}", "${sexo}", "${tipo_sangre}", ${dni});`, (err, rows) => {
            conexion.release();
            if(!err) {
                res.send(rows);
                res.end();
            } else {
                console.log(err);
            }
        });
    });
    
};

module.exports = {
    obtenerPacientes,
    crearPaciente
};