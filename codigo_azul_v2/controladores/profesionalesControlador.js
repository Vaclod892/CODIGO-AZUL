const pool = require('../conexion');  // requerido para establecer conexiones con la base de datos

// Obtiene los profesionales, si no se provee un filtro específico, se devuelven todos por defecto
const obtenerProfesionales = (req, res) => {
    if (req.query.id || req.query.nombres || req.query.apellidos || req.query.especialidad) {

        // Se define un filtro para el profesional, ya sean los nombres o apellidos, el id o la especialidad
        const filtro = req.query.id ? parseInt(req.query.id) : 
        req.query.nombres ? '"' + req.query.nombres + '"' : req.query.apellidos ? '"' + req.query.apellidos + '"' : '"' + req.query.especialidad + '"';

        // De acuerdo al identificador provisto se define el campo de filtro para la consulta
        const campo = req.query.id ? "id" : req.query.nombres ? "nombre_usuario" : req.query.apellidos ? "apellidos" : "especialidad";

        pool.getConnection((err, conexion) => {
            if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from profesionales WHERE ${campo} = ${filtro}`, (err, rows) => {
                conexion.release();
                if (!err) {
                    if(row.length > 0) {
                        return res.json({ "status": 200, "profesionales": rows });
                    } else {
                        return res.json({"status": 500, "mensaje": `No se han encontrado profesionales`});
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
    
            conexion.query('SELECT * from profesionales', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.json({ "status": 200, "profesionales": rows });
                        return;
                    } else {
                        return res.json({"status": 500, "mensaje": "No se han encontrado profesionales"});
                    }
                } else {
                    return res.json({"status": 500, "mensaje": `La operación ha fallado ${err}`});
                }
            });
        });
    }
};

// Carga un nuevo profesional al sistema
const cargarProfesional = (req, res) => {
    if(!req.body.fecha_nacimiento || !req.body.dni || !req.body.nombres || !req.body.apellidos || !req.body.especialidad || !req.body.email) {
        return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios"});
    }

    // Se obtienen los datos del nuevo profesional
    const { fecha_nacimiento } = req.body;
    const { dni } = req.body;
    const { nombres } = req.body;
    const { apellidos } = req.body;
    const { especialidad } = req.body;
    const { email } = req.body;

    pool.getConnection((err, conexion) => {
        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO profesionales (fecha_nacimiento, dni, nombres, apellidos, especialidad, email) VALUES ("${fecha_nacimiento}", ${dni}, "${nombres}", "${apellidos}", "${especialidad}", "${email}");`, (err, rows) => {
            conexion.release();
            if(!err) {
                res.json({"status": 201, "mensaje": `Profesional ${apellidos} ${nombres} cargado exitosamente` });
                res.end();
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}`});
            }
        });
    });
};

// Se da de baja a un profesional
const bajaProfesional = (req, res) => {
    if(!req.query.id) {
        return res.json({ "status": 400, "mensaje": "No se ha provisto un identificador" });
    }

    // Se obtiene el identificador del profesional
    const id = parseInt(req.query.id);
    
    pool.getConnection((err, conexion) => {
        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        // Se modifica el estado en la base de datos
        conexion.query(`UPDATE profesionales SET estado = "baja" WHERE id = ${id};`, (err, row) => {
            conexion.release();
            if(!err) {
                return res.json({ "status": 200, "mensaje": `El profesional con el id ${id} ha sido dado de baja` });
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}`});
            }
        })
    });
}

module.exports = {
    obtenerProfesionales,
    cargarProfesional,
    bajaProfesional
};