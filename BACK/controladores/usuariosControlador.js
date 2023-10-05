const pool = require('../conexion');
const { format } = require('date-fns');

const obtenerUsuarios = (req, res) => {
    if (req.query.nombre) {
        const nombre = req.query.nombre;
        pool.getConnection((err, conexion) => {
            if(err) throw err;
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from usuarios WHERE nombre_usuario = "${nombre}"`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`No se ha encontrado al usuario: ${nombre}`);
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

            conexion.query(`SELECT * from usuarios WHERE id = ${id};`, (err, row) => {
                conexion.release();
                if(!err) {
                    if(row.length > 0) {
                        res.send(row);
                        console.log(row);
                    } else {
                        res.send(`El usuario con el id ${id} no existe`);
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
    
            conexion.query('SELECT * from usuarios', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.send(rows);
                        console.log(rows);
                    } else {
                        res.send('No se han encontrado usuarios');
                    }
                    res.end();
                } else {
                    throw err;
                }
            });
        });
    }
};

const crearUsuario = (req, res) => {
    console.log(req.body);

    // datos del usuario nuevo
    const fecha_creacion = format(new Date(), 'y/MM/dd');
    const nombre = req.body.nombre;
    const contraseña = req.body.contraseña;
    console.log(req.body);
    let rol;
    if(req.body.rol !== "admin") {
        rol = null;
    } else {
        rol = req.body.rol;
    }

    pool.getConnection((err, conexion) => {
        if(err) throw err;
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO usuarios (fecha_creacion, nombre_usuario, contraseña, rol) VALUES ("${fecha_creacion}", "${nombre}", "${contraseña}", "${rol}");`, (err, rows) => {
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

const eliminarUsuario = (req, res) => {
    if(!req.query.id) {
        res.send('ERROR: No se ha provisto un ID');
    } else {
        const id = parseInt(req.query.id);
        
        pool.getConnection((err, conexion) => {
            if (err) throw err;
    
            console.log(`conectado con id: ${conexion.threadId}`);
    
            conexion.query(`DELETE FROM usuarios WHERE id = ${id}`, (err, row) => {
                conexion.release();
                if(!err) {
                    res.send(`El usuario con el id ${id} ha sido eliminado`);
                    res.end();
                } else {
                    console.log(err);
                }
            })
        });
    }
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    eliminarUsuario
};