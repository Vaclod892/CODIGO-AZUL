const pool = require('../conexion'); // requerido para establecer conexiones con la base de datos
const bcrypt = require('bcryptjs'); // requerido para encriptar y validar contraseñas
const { format } = require('date-fns'); // requerido para modificar el formato de la fecha

// Crea usuarios genéricos
const registro = async (req, res) => {
    // Se obtienen los datos del nuevo usuario
    if(!req.body.nombre || !req.body.contraseña) return res.status(400).json({ "mensaje": "No se han provisto los datos necesarios"});
    const { nombre, contraseña } = req.body;

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
                if (!conflicto){
                    setTimeout(async () => {
                        try {
                            // Se encripta la contraseña
                            const contraseña_encriptada = await bcrypt.hash(contraseña, 10);
                    
                            pool.getConnection((err, conexion) => {
                                if(err) {
                                    return res.status(500).json({ "mensaje": "Hubo un fallo en la conexión" });
                                }
                                console.log(`Conectado con id: ${conexion.threadId}`);
                    
                                // Se lleva a cabo la creación del usuario
                                conexion.query(`INSERT INTO usuarios (fecha_creacion, nombre_usuario, contraseña) VALUES ("${fecha_creacion}", "${nombre}", "${contraseña_encriptada}");`, (err, rows) => {
                                    conexion.release();
                                    if(!err) {
                                       return res.status(201).json({ "mensaje": "Usuario registrado exitosamente" })
                                    } else {
                                        return res.status(500).json({ "mensaje": `La operación ha fallado: ${err}` });
                                    }
                                });
                            });
                        } catch (err) {
                            return res.status(500).json({ "mensaje": `La operación ha fallado: ${err}` });
                        }
                    }, 0);
                } else {
                    return res.status(409).json({ "mensaje": "El nombre de usuario no está disponible" });
                }
            } else {
                return res.status(500).json({ "mensaje": `La operación ha fallado: ${err}` })
            }
        });
    })
};

module.exports = { registro };