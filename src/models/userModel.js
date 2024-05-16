const { pool } = require('../config/database');

exports.createUser = async (username, email, hashedPassword, role) => {
    try {
        const query = `
        INSERT INTO users (username, email, password, role) 
        VALUES (?, ?, ?, ?);
        `;
        const [result] = await pool.execute(query, [username, email, hashedPassword, role]);
        console.log('Resultado:', result);
        return { success: true };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return { success: false, error };
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute(query, [email]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        throw error;
    }
};


// Función para obtener todos los usuarios
exports.getAllUsers = async () => {
    try {
        const query = `SELECT * FROM users`;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw error; // Lanza el error para que pueda ser manejado por la función que llame a getAllUsers
    }
};

