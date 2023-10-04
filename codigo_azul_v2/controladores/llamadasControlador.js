const pool = require('../conexion'); // requerido para establecer conexiones con la base de datos
const { format } = require('date-fns'); // requerido para modificar el formato de la fecha

// Obtiene las llamadas, si no se provee un filtro específico, se devuelven todas por defecto
const obtenerLlamadas = (req, res) => {
    if (req.query.id || req.query.tipo || req.query.estado || req.query.ubicacion ) {

        // Se define un filtro para la llamada, ya sea el id, tipo, estado o ubicación
        const filtro = req.query.id ? parseInt(req.query.id) : 
        req.query.tipo ? '"' + req.query.tipo + '"' : req.query.estado ? '"' + req.query.estado + '"' : '"' + req.query.ubicacion + '"';

        // De acuerdo al identificador provisto se define el campo de filtro para la consulta
        const campo = req.query.id ? 'id' : req.query.tipo ? 'tipo' : req.query.estado ? 'estado' : 'ubicacion';

        pool.getConnection((err, conexion) => {
            if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from llamadas WHERE ${campo} = ${filtro}`, (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.json({ "status": 200, "llamadas": rows });
                        res.end();
                    } else {
                        return res.json({"status": 500, "mensaje": `No se han encontrado llamadas`});
                    }
                } else {
                    return res.json({"status": 500, "mensaje": `La operación ha fallado: ${err}`});
                }
            });
        });
    } else {
        pool.getConnection((err, conexion) => {
            if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            console.log(`Conectado con id: ${conexion.threadId}`);
    
            conexion.query('SELECT * from llamadas', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        return res.json({ "status": 200, "llamadas": rows });
                    } else {
                        return res.json({"status": 500, "mensaje": "No se han encontrado llamadas"});
                    }
                } else {
                    return res.json({"status": 500, "mensaje": `La operación ha fallado ${err}`});
                }
            });
        });
    }
};

// Emite una llamada
const emitirLlamada = (req, res) => {
    if(!req.body.tipo || !req.body.ubicacion || !req.body.paciente_id) {
        return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios"});
    }

    // Se obtienen los datos de la nueva llamada
    const { tipo } = req.body;
    const { ubicacion } = req.body;
    const { paciente_id } = req.body;

    // Se calcula la fecha de emisión de la llamada
    const fecha_emision = format(new Date, "yyyy/MM/dd HH:m:ss");

    pool.getConnection((err, conexion) => {
        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO llamadas (fecha_emision, tipo, ubicacion, paciente_id) VALUES ("${fecha_emision}", "${tipo}", "${ubicacion}", ${paciente_id});`, (err, rows) => {
            conexion.release();
            if(!err) {
                res.json({"status": 201, "mensaje": `Llamada emitida exitosamente en ${ubicacion}` });
                res.end();
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}`})
            }
        });
    });
    
};

// Atiende la llamada
const atenderLlamada = (req, res) => {
    if(!req.query.id || !req.query.profesional_id) {
        return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios"});
    }

    // Se obtiene el identificador de la llamada
    const id = parseInt(req.query.id);

    // Se obtiene el identificador del profesional a cargo
    const profesional_id = parseInt(req.query.profesional_id);

    // Se calcula la fecha de atención
    const fecha_atencion = format(new Date(), 'y/MM/dd HH:m:ss');
    
    pool.getConnection((err, conexion) => {
        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        // Obtiene la primera zona disponible

        let zona_id;
        conexion.query(`SELECT * from zonas WHERE estado = "disponible";`, (err, rows) => {
            if(!err) {
                if(rows.length > 0) {
                    zona_id = rows[0].id;
                    pool.getConnection((err, conexion) => {
                        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
                        console.log(`Conectado con id: ${conexion.threadId}`);
            
                        // Se asigna la zona disponible a la llamada
                        conexion.query(`UPDATE llamadas SET profesional_id = ${profesional_id}, estado = "atencion", zona_id = ${zona_id}, fecha_atencion = "${fecha_atencion}" WHERE id = ${id};`, (err, rows) => {
                            if(!err) {
                                console.log("La llamada fue atendida");
                            } else {
                                return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
                            }                     
                        });
                        conexion.query(`UPDATE zonas SET estado = "ocupada" WHERE id = ${zona_id};`, (err, rows) => {
                            conexion.release();
                            if(!err) {
                                res.json({ "status": 200 })
                            } else {
                                return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
                            }      
                        })
                    });
                } else {
                    return res.json({ "status": 500, "mensaje": `No hay zonas libres`});
                }
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}`});
            }
        });
    });
}

// La emergencia finaliza y se libera la zona de atención
const terminarLlamada = (req, res) => {
    if(!req.query.id) {
        return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios"});
    }

    // Se obtiene el identificador de la llamada
    const id = parseInt(req.query.id);

    // Se calcula la fecha de alta
    const fecha_alta = format(new Date(), 'yyyy/MM/dd HH:m:s');

    pool.getConnection((err, conexion) => {
        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`SELECT zona_id from llamadas WHERE id = ${id};`, (err, rows) => {
            conexion.release();
            if(!err) {
                const zona_id = rows[0].zona_id;
                // Se libera la zona de atención
                pool.getConnection((err, conexion) => {
                    if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
                    console.log(`Conectado con id: ${conexion.threadId}`);
                    conexion.query(`SELECT descripcion from zonas WHERE id = ${zona_id};`, (err, rows) => {
                        if(err) {
                            return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
                        } else {
                            const descripcion = rows[0].descripcion;
                            conexion.query(`UPDATE zonas SET estado = "disponible" WHERE id = ${zona_id};`, (err, rows) => {
                                if(!err) {
                                    console.log(`${descripcion} se ha desocupado`);
                                    conexion.query(`UPDATE llamadas SET estado = "alta", fecha_alta = "${fecha_alta}" WHERE id = ${id};`, (err, rows) => {
                                        conexion.release();
                                        if(!err) {
                                            res.json({ "status": 200, "mensaje": `${descripcion} se ha desocupado` });
                                            res.end();
                                        } else {
                                            return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
                                        }
                                    });
                                } else {
                                    return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
                                }
                            });
                        }
                    });
                })
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
            }                     
        });
    });
}

module.exports = {
    obtenerLlamadas,
    emitirLlamada,
    atenderLlamada,
    terminarLlamada
};