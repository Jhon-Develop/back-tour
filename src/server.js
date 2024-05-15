require('dotenv').config();
const { pool } = require('./config/database');
const app = require('./app');

const port = process.env.PORT || 4000;


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectar a la base de datos', err);
        process.exit(1);
    } else {
        console.log('Conexión exitosa a la base de datos', res);
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
        });
    }
});
