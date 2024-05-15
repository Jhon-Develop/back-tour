const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// Verifica si la variable de entorno DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definida en el archivo .env');
}

// Parsea la URL de la base de datos
const dbUrl = new URL(process.env.DATABASE_URL);

// Extrae los parámetros adicionales de la URL para configurar correctamente SSL
const ssl = dbUrl.searchParams.get('sslmode') === 'require';

// Crea la configuración de la conexión a la base de datos
const dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substr(1), // Elimina el primer slash del pathname
    port: dbUrl.port,
    ssl: ssl ? { rejectUnauthorized: false } : false
};

// Crea el pool de conexiones a la base de datos
const pool = mysql.createPool(dbConfig);

// Ejecuta una consulta de prueba para verificar la conexión
pool.query('SELECT 1', (error, results) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

// Maneja cualquier error que ocurra durante la conexión
pool.on('error', function(err) {
    console.error('Error al conectar a la base de datos:', err);
});

module.exports = { pool };


// const mysql = require('mysql');

// const connection = mysql.createConnection ({
//     host: 'localhost',
//     database: 'tour.db',
//     user: 'root',
//     password: ''
// })

// connection.connect(function(err){
//     if (err){
//         throw err;
//     } else {
//         console.log('conexion exitosa')
//     }
// }); 
