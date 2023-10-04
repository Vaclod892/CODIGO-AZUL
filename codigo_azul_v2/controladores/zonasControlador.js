const pool = require('../conexion');  // requerido para establecer conexiones con la base de datos

// Obtiene las zonas, si no se provee un filtro específico, se devuelven todas por defecto
const obtenerZonas = (req, res) => {
    if (req.query.id || req.query.descripcion || req.query.estado) {

        // Se define un identificador para la zona, ya sea el id, la descripción o el estado
        const identificador = req.query.id ? parseInt(req.query.id) : req.query.descripcion 
        ? '"' + req.query.descripcion + '"' : '"' + req.query.estado + '"';
    
        // De acuerdo al identificador provisto se define el campo de filtro para la consulta
        const campo = req.query.id ? "id" : req.query.descripcion ? "descripcion" : "estado";

        pool.getConnection((err, conexion) => {
            if(err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
            console.log(`Conectado con id: ${conexion.threadId}`);
    
            conexion.query(`SELECT * from zonas WHERE ${campo} = ${identificador}`, (err, rows) => {
                conexion.release();
                if(!err) {
                    if(rows.length > 0) {
                        res.json({ "status": 200, "zonas": rows });
                        res.end();
                    } else {
                        return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
                    }
                } else {
                    return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}` });
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
                        res.json({ "status": 200, "mensaje": rows });
                        res.end();
                    } else {
                        return res.json({ "status": 500, "mensaje": `No se han encontrado zonas`});
                    }
                } else {
                    return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}`});
                }
            });
        });
    }
};

// Crea una nueva zona
const crearZona = (req, res) => {
    if (!req.body.descripcion) return res.json({ "status": 400, "mensaje": "No se han provisto los datos necesarios" })
    // Se obtienen los datos de la nueva zona
    const { descripcion } = req.body;

    pool.getConnection((err, conexion) => {
        if (err) return res.json({ "status": 500, "mensaje": "Hubo un fallo en la conexión" });
        console.log(`Conectado con id: ${conexion.threadId}`);

        conexion.query(`INSERT INTO zonas (descripcion) VALUES ("${descripcion}");`, (err, rows) => {
            conexion.release();
            if(!err) {
                res.json({ "status": 201, "mensaje": "La zona se ha creado exitosamente" });
                res.end();
            } else {
                return res.json({ "status": 500, "mensaje": `La operación ha fallado ${err}`});
            }
        });
    });
};

module.exports = {
    obtenerZonas,
    crearZona
};