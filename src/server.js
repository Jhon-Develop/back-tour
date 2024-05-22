require('dotenv').config();
const { pool } = require('./config/database');
const app = require('./app');

const port = process.env.PORT || 4000;

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos');
        connection.release();

        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto http://localhosst:${port}`);
        });
    } catch (err) {
        console.error('Error al conectar a la base de datos', err);
        process.exit(1);
    }
})();