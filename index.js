const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConection } = require('./database/config');


//Crear el Servidor de Express
const app = express();

//base de datos
dbConection();

//CORS
app.use(cors())


//Directorio Publico
app.use( express.static('public') );

//lectura y parseo de el body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor Corriendo en puerto ${ process.env.PORT }`)
})