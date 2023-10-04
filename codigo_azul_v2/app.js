const express = require('express'); // Provee funcionalidades HTTP y Middleware
const app = express();
const PORT = process.env.PORT || 5000; // El puerto en el que estará el servidor
const path = require('path'); // Provee funciones para trabajar con rutas
const cookieParser = require('cookie-parser'); // Decodifica las cookies de las consultas
const verificarJWT = require('./middleware/verificarJWT'); // Verifica la integridad de los tokens de acceso
const verificarRol = require('./middleware/verificarRol'); // Verifica si el usuario cuenta con permisos de administrador
const registrarConsulta = require('./middleware/registroConsultas'); // Mantiene un registro de las consultas
const cors = require('cors'); // Permite configurar CORS
const corsConfig = require('./config/corsConfig');
const bodyParser = require('body-parser'); // Decodifica los datos de las consultas

app.use(registrarConsulta);
app.use(cors(corsConfig));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'vistas')));

app.use('/api/registro', require('./rutas/api/rutaRegistro'));
app.use('/api/inicioSesion', require('./rutas/api/rutaInicioSesion'));
app.use('/api/actualizarToken', require('./rutas/api/rutaActualizarToken'));
app.use('/api/cierreSesion', require('./rutas/api/rutaCierreSesion'));
app.use(verificarJWT); // Solo usuarios
app.use('/api/llamadas', require('./rutas/api/rutaLlamadas'));
app.use('/api/pacientes', require('./rutas/api/rutaPacientes'));
app.use('/api/zonas', require('./rutas/api/rutaZonas'));
app.use('/api/profesionales', require('./rutas/api/rutaProfesionales'));
app.use(verificarRol); // Solo administradores
app.use('/api/usuarios', require('./rutas/api/rutaUsuarios'));

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});