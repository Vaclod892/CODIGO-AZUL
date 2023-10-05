const pool = require('../conexion');

const obtenerZonas = (req, res) => {
    if (req.query.descripcion) {
        const descripcion = req.query.descripcion;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from zonas WHERE descripcion = "${descripcion}"`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                    } else {
                        res.send(`No se ha encontrado la zona: ${descripcion}`);
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

            conexion.query(`SELECT * from zonas WHERE id = ${id};`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                    } else {
                        res.send(`La zona con el id ${id} no existe`);
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
    
            conexion.query('SELECT * from zonas', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.send(rows);
                        console.log(rows);
                    } else {
                        res.send('No se han encontrado zonas');
                    }
                    res.end();
                } else {
                    throw err;
                }
            });
        });
    }
};

const crearZona = (req, res) => {

    // datos de la zona nuevo
    const descripcion = req.query.descripcion;

    pool.getConnection((err, conexion) => {
        if(err) throw err;
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO zonas (descripcion) VALUES ("${descripcion}");`, (err, rows) => {
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

// toDo
// const eliminarZona = (req, res) => {
//     if(!req.query.id) {
//         res.send('ERROR: No se ha provisto un ID');
//     } else {
//         const id = parseInt(req.query.id);
        
//         pool.getConnection((err, conexion) => {
//             if (err) throw err;
    
//             console.log(`conectado con id: ${conexion.threadId}`);
    
//             conexion.query(`DELETE FROM Zonas WHERE id = ${id}`, (err, row) => {
//                 conexion.release();
//                 if(!err) {
//                     res.send(`El usuario con el id ${id} ha sido eliminado`);
//                     res.end();
//                 } else {
//                     console.log(err);
//                 }
//             })
//         });
//     }
// }

module.exports = {
    obtenerZonas,
    crearZona,
};