const app = require('express')();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/api/usuarios', require('./rutas/api/rutaUsuarios'));
app.use('/api/profesionales', require('./rutas/api/rutaProfesionales'));
app.use('/api/pacientes', require('./rutas/api/rutaPacientes'));
app.use('/api/llamadas', require('./rutas/api/rutaLlamadas'));
app.use('/api/zonas', require('./rutas/api/rutaZonas'));

app.listen(PORT, () => {
    console.log(`escuchando en el puerto: ${PORT}`);
});