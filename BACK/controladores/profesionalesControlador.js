const pool = require('../conexion');
const app = require('express')();
const bodyParser = require('body-parser');
const { format } = require('date-fns');

const obtenerProfesionales = (req, res) => {
    if (req.query.nombres) {
        const nombres = req.query.nombres;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from profesionales WHERE nombres = "${nombres}";`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se ha encontrado al profesional: ${nombres}`);
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

            conexion.query(`SELECT * from profesionales WHERE apellidos = "${apellidos};"`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se ha encontrado al profesional: ${apellidos}`);
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

            conexion.query(`SELECT * from profesionales WHERE id = ${id};`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`El profesional con el id ${id} no existe`);
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
    
            conexion.query('SELECT * from profesionales', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.send(rows);
                        console.log(rows);
                    } else {
                        res.send('No se han encontrado profesionales');
                    }
                    res.end();
                } else {
                    throw err;
                }
            });
        });
    }
};

const crearProfesional = (req, res) => {
    console.log(req.body);

    // datos del profesional nuevo
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const especialidad = req.body.especialidad;

    pool.getConnection((err, conexion) => {
        if(err) throw err;
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO profesionales (fecha_nacimiento, nombres, apellidos, especialidad) VALUES ("${fecha_nacimiento}", "${nombres}", "${apellidos}", "${especialidad}");`, (err, rows) => {
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

const bajaProfesional = (req, res) => {
    if(!req.query.id) {
        res.send('ERROR: No se ha provisto un ID');
    } else {
        const id = parseInt(req.query.id);
        
        pool.getConnection((err, conexion) => {
            if (err) throw err;
    
            console.log(`conectado con id: ${conexion.threadId}`);
    
            conexion.query(`UPDATE profesionales SET estado = "baja" WHERE id = ${id};`, (err, row) => {
                conexion.release();
                if(!err) {
                    res.send(`El profesional con el id ${id} ha sido dado de baja`);
                    res.end();
                } else {
                    console.log(err);
                }
            })
        });
    }
}

module.exports = {
    obtenerProfesionales,
    crearProfesional,
    bajaProfesional
};