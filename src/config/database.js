const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definida en el archivo .env');
}

const dbUrl = new URL(process.env.DATABASE_URL);

const ssl = dbUrl.searchParams.get('sslmode') === 'require';

const dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substr(1),
    port: dbUrl.port,
    ssl: ssl ? { rejectUnauthorized: false } : false
};

const pool = mysql.createPool(dbConfig);

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos exitosa');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
})();

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
