require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/sucursales', require('./routes/sucursales') );
app.use( '/api/empleados', require('./routes/empleados') );
app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/login', require('./routes/auth') );

app.listen( process.env.PORT, () =>  {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});