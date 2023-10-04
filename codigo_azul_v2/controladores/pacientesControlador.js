const pool = require('../conexion');  // requerido para establecer conexiones con la base de datos

// Obtiene los pacientes, si no se provee un filtro específico, se devuelven todos por defecto
const obtenerPacientes = (req, res) => {
    if (req.query.id || req.query.dni || req.query.nombres || req.query.apellidos || req.query.sexo || req.query.tipo_sangre) {

        // Se define un filtro para el paciente, ya sean los nombres o apellidos, el id o la sexo
        const filtro = req.query.id ? parseInt(req.query.id) : req.query.dni ? parseInt(req.query.dni) :
        req.query.nombres ? '"' + req.query.nombres + '"' : req.query.apellidos ? '"' + req.query.apellidos + '"' : 
        req.query.sexo ? '"' + req.query.sexo + '"' : '"' + req.query.tipo_sangre + '"';

        // De acuerdo al identificador provisto se define el campo de filtro para la consulta
        const campo = req.query.id ? 'id' : req.query.nombres ? 'nombres' : req.query.apellidos ? 'apellidos' : req.query.sexo ? 'sexo' : req.query.dni ? 'dni' : "tipo_sangre";

        pool.getConnection((err, conexion) => {
            if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            console.log(`Conectado con id: ${conexion.threadId}`);

            conexion.query(`SELECT * from pacientes WHERE ${campo} = ${filtro}`, (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.json({ "status": 200, "pacientes": rows });
                        res.end();
                    } else {
                        return res.json({"status": 500, "mensaje": `No se han encontrado pacientes`});
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
    
            conexion.query('SELECT * from pacientes', (err, rows) => {
                conexion.release();
                if (!err) {
                    if(rows.length > 0) {
                        res.json({ "status": 200, "pacientes": rows });
                        res.end();
                    } else {
                        return res.json({"status": 500, "mensaje": "No se han encontrado pacientes"});
                    }
                } else {
                    return res.json({"status": 500, "mensaje": `La operación ha fallado ${err}`});
                }
            });
        });
    }
};

// Carga un nuevo paciente al sistema
const cargarPaciente = (req, res) => {
    if(!req.body.fecha_nacimiento || !req.body.dni || !req.body.nombres || !req.body.apellidos || !req.body.sexo || !req.body.tipo_sangre) {
        return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios"});
    }

    // Se obtienen los datos del nuevo paciente
    const { fecha_nacimiento } = req.body;
    const { dni } = req.body;
    const { nombres } = req.body;
    const { apellidos } = req.body;
    const { sexo } = req.body;
    const { tipo_sangre } = req.body;

    pool.getConnection((err, conexion) => {
        if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO pacientes (fecha_nacimiento, dni, nombres, apellidos, sexo, tipo_sangre) VALUES ("${fecha_nacimiento}", ${dni}, "${nombres}", "${apellidos}", "${sexo}", "${tipo_sangre}");`, (err, rows) => {
            conexion.release();
            if(!err) {
                res.json({"status": 201, "mensaje": `Paciente ${apellidos} ${nombres} cargado exitosamente` });
                res.end();
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado: ${err}`});
            }
        });
    });
    
};

module.exports = {
    obtenerPacientes,
    cargarPaciente
};