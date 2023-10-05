const pool = require('../conexion');
const app = require('express')();
const bodyParser = require('body-parser');
const { format } = require('date-fns');
const lodash = require('lodash');

const obtenerLlamadas = (req, res) => {
    if (req.query.tipo) {
        const tipo = req.query.tipo;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from llamadas WHERE tipo = "${tipo}";`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se ha encontrado ningún llamado de tipo: ${tipo}`);
                    }
                    res.end();
                } else {
                    throw err;
                }
            })
        })
    } else if (req.query.estado) {
        const estado = req.query.estado;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from llamadas WHERE estado = "${estado};"`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se ha encontrado ningún llamado de estado: ${estado}`);
                    }
                    res.end();
                } else {
                    throw err;
                }
            })
        })
    } else if (req.query.ubicacion) {
        const ubicacion = req.query.ubicacion;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from llamadas WHERE ubicacion = "${ubicacion}";`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se encontraron llamados en ${ubicacion}`);
                    }
                    res.end();
                } else {
                    throw err;
                }
            })
        })
    } else {
        pool.getConnection((err, conexion) => {
           
            console.log(`Conectado con id: ${conexion.threadId}`);
    
            conexion.query('SELECT * from llamadas;', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.json({
                            status: "ok",
                            llamados: rows
                        });
                    } else {
                        res.send('No se han encontrado llamados');
                    }
                    res.end();
                } else {
                    throw err;
                }
            });
        });
    }
};

const crearLlamada = (req, res) => {
    console.log(req.body);

    // datos de la llamada nueva
    const fecha_emision = format(new Date(), 'y/MM/dd');
    const ubicacion = req.body.ubicacion;
    const tipo = req.body.tipo;
    const estado = "pendiente";

    pool.getConnection((err, conexion) => {
        if(err) throw err;
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO llamadas (fecha_emision, ubicacion, tipo, estado) VALUES ("${fecha_emision}", "${ubicacion}", "${tipo}", "${estado}");`, (err, rows) => {
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

const modificarLlamada = (req, res) => {
    if(!req.query) {
        res.send('Parámetros no especificados: id requerido');
    } else if (req.query.profesional_id) {
        const profesional_id = parseInt(req.query.profesional_id);
        const fecha_atencion = format(new Date(), 'y/MM/dd HH:m:s');
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);
            let zonas_ocupadas;
            let zonas;
            let zonas_libres;
            let zona_id;

            conexion.query(`SELECT zona_id llamadas;`, (err, rows) => {
                conexion.release();
                if(!err) {
                    zonas_ocupadas = rows;
                } else {
                    console.log(err);
                }
            });
            conexion.query(`SELECT * zonas;`, (err, rows) => {
                conexion.release();
                if(!err) {
                    zonas = rows;
                } else {
                    console.log(err);
                }
            });

            zonas_libres = lodash.difference(zonas, zonas_ocupadas);

            zona_id = zonas_libres[0];
        });

        if (!req.query.id) {
            res.send('ERROR: ID no provisto')
        } else {
            const id = req.query.id;
            pool.getConnection((err, conexion) => {
                if(err) throw err;
                console.log(`Conectado con id: ${conexion.threadId}`);

                conexion.query(`UPDATE llamadas SET estado = "atencion", zona_id = ${zona_id}, fecha_atencion = ${fecha_atencion}, profesional_id = ${profesional_id} WHERE id = ${id};`, (err, rows) => {
                    conexion.release();
                    if(!err) {
                        res.send(rows);
                        res.end();
                    } else {
                        console.log(err);
                    }
                });
            });
        }
    }
}

module.exports = {
    obtenerLlamadas,
    crearLlamada,
    modificarLlamada
};