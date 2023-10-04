const fs = require('fs'); // Provee funciones para trabajar con archivos
const fsPromises = require('fs'); // Provee funciones para trabajar con archivos asíncronamente
const path = require('path'); // Provee funciones para trabajar con rutas
const { format } = require('date-fns'); // requerido para modificar el formato de la fecha
const { v4: uuid } = require('uuid'); // Genera identificadores únicos

// Mantiene un registro de las consultas y operaciones
const registrarConsulta = async (req, res, next) =>  {
    const fecha_consulta = `${format(new Date, 'yyyy/MM/dd HH:m:ss')}`;
    const mensaje = `${req.method}\t${req.headers.origin}\t${req.url}`;
    const registroConsulta = `${fecha_consulta}\t${uuid()}\t${mensaje}\n`;
    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'registros'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'registros'), (err) => {
                console.error(err);
            });
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'registros', 'registroConsulta.txt'), registroConsulta, (err) => {
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    next();
};

module.exports = registrarConsulta;