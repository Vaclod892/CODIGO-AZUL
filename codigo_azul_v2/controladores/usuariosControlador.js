const pool = require('../conexion'); // requerido para establecer conexiones con la base de datos
const bcrypt = require('bcryptjs'); // requerido para encriptar y validar contraseñas
const { format } = require('date-fns'); // requerido para modificar el formato de la fecha

// Obtiene los usuarios, si no se provee un filtro específico, se devuelven todos por defecto
const obtenerUsuarios = (req, res) => {
    if (req.query.nombre || req.query.id || req.query.rol) {

        // Se define un identificador para el usuario, ya sea el nombre, el id o el rol
        const identificador = req.query.id ? parseInt(req.query.id) : 
        req.query.nombre ? '"' + req.query.nombre + '"' : '"' + req.query.rol + '"';

        // De acuerdo al identificador provisto se define el campo de filtro para la consulta
        const campo = req.query.id ? "id" : req.query.nombre ? "nombre_usuario" : "rol";

        pool.getConnection((err, conexion) => {
            if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from usuarios WHERE ${campo} = "${identificador}"`, (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.json({ "status": 200, "usuarios": rows });
                        res.end();
                    } else {
                        res.json({"status": 500, "mensaje": `No se han encontrado usuarios`});
                        res.end();
                    }
                } else {
                    res.json({"status": 500, "mensaje": `La operación ha fallado: ${err}`});
                    res.end();
                }
            });
        });
    } else {
        pool.getConnection((err, conexion) => {
            if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            console.log(`Conectado con id: ${conexion.threadId}`);
    
            conexion.query('SELECT * from usuarios', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.json({ "status": 200, "usuarios": rows });
                        res.end();
                    } else {
                        return res.json({"status": 500, "mensaje": `La operación ha fallado: ${err}`});
                    }
                } else {
                    return res.json({"status": 500, "mensaje": `La operación ha fallado: ${err}`});
                }
            });
        });
    }
};

// Crea usuarios de cualquier tipo (genérico o administrador)
const crearUsuario = async (req, res) => {
    // Se obtienen los datos del nuevo usuario
    if(!req.body.nombre || !req.body.contraseña) {
        return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios"});
    }

    const { nombre, contraseña } = req.body;
    const rol = req.body.rol === "admin" ? req.body.rol : "generico";

    // Se calcula la fecha de creación del usuario
    const fecha_creacion = format(new Date(), 'yyyy/MM/dd');
   
    // Se asegura que el nombre de usuario no exista en la base de datos
    pool.getConnection((err, conexion) => {
        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);
        
        // Se obtiene un arreglo con todos los nombres de usuario de la base de datos
        conexion.query(`SELECT nombre_usuario from usuarios;`, (err, rows) => {
            conexion.release();
            if(!err) {
                const lista_nombres = rows;
                // Se verifica que el nombre de usuario ingresado no exista en la base de datos
                const conflicto = lista_nombres.find((o) => o.nombre_usuario === nombre);
                if (conflicto){
                    return res.json({ "status": 409, "mensaje": "El nombre de usuario no está disponible" });
                }
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}` })
            }
        });
    })
    try {
        // Se encripta la contraseña
        const contraseña_encriptada = await bcrypt.hash(contraseña, 10);

        pool.getConnection((err, conexion) => {
            if(err) {
                console.log(err);
                return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            }
            console.log(`Conectado con id: ${conexion.threadId}`);

            // Se lleva a cabo la creación del usuario
            conexion.query(`INSERT INTO usuarios (fecha_creacion, nombre_usuario, contraseña, rol) VALUES ("${fecha_creacion}", "${nombre}", "${contraseña_encriptada}", "${rol}");`, (err, rows) => {
                conexion.release();
                if(!err) {
                    res.json({ "status": 201, "mensaje": "El usuario ha sido creado exitosamente" });
                    res.end();
                } else {
                    return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}` });
                }
            });
        });
    } catch (err) {
        return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}` });
    }
};

// Modifica los roles de los usuarios
const modificarRol = (req, res) => {
    if (!(req.query.id || req.query.nombre) || !req.query.rol) return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios"});
    // Se define un identificador para el usuario, ya sea el nombre o el id
    const identificador = req.query.id ? parseInt(req.query.id) : '"' + req.query.nombre + '"';
    // De acuerdo al identificador provisto se define el campo de filtro para la consulta
    const campo = req.query.id ? "id" : "nombre_usuario";

    // Se define el nuevo rol del usuario seleccionado
    if (!req.query.rol === "admin" || !req.query.rol === "generico") {
        return res.json({ "status": 400, "mensaje": "El rol provisto es inválido"});
    }
    const { rol } = req.query;

    pool.getConnection((err, conexion) => {
        if (err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`conectado con id ${conexion.threadId}`);

        conexion.query(`UPDATE usuarios SET rol = "${rol}" WHERE ${campo} = ${identificador};`, (err, row) => {
            if (err) {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
            } else {
                res.json({ "status": 200, "mensaje": `El usuario ${identificador} es ahora ${rol}`});
                res.end();
            }
        })
    })
}

// Elimina un usuario de la base de datos
const eliminarUsuario = (req, res) => {
    if(!(req.query.id || req.query.nombre)) {
        return res.json({ "status": 400, "mensaje": "No se ha provisto un identificador"});
    }
    
    // Se define un identificador para el usuario, ya sea el nombre o el id
    const identificador = req.query.id ? parseInt(req.query.id) : '"' + req.query.nombre + '"';

    // De acuerdo al identificador provisto se define el campo de filtro para la consulta
    const campo = req.query.id ? "id" : "nombre_usuario";

    pool.getConnection((err, conexion) => {
        if (err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`conectado con id ${conexion.threadId}`);

        conexion.query(`DELETE FROM usuarios WHERE ${campo} = ${identificador}`, (err, row) => {
            conexion.release();
            if(!err) {
                res.json({ "status": 200, "mensaje": `El usuario ${identificador} ha sido eliminado` });
                res.end();
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}`});
            }
        })
    });
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    modificarRol,
    eliminarUsuario
};