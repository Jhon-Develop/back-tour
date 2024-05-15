const { pool } = require('../config/database');

exports.createUser = async (username, email, hashedPassword, role) => {
    try {
        const query = `
        INSERT INTO users (username, email, password, rol) 
        VALUES (?, ?, ?, ?);
        `;

        const result = await pool.query(query, [username, email, hashedPassword, role]);
        console.log('Resultado:', result);
        return { success: true }; // Indica éxito en la operación
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return { success: false, error }; // Indica que hubo un error en la operación
    }
};


exports.getUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    const { rows } = await pool.query(query, [email]);
    if (rows && rows.length > 0) {
        return rows[0]; // Devuelve el primer usuario encontrado
    } else {
        return null; // Devuelve null si no se encuentra ningún usuario con ese email
    }
};

exports.getAllUser = async (username) => {
    const query = `SELECT * FROM users `;
    const { rows } = await pool.query(query, [username]);
    if (rows && rows.length > 0) {
        return rows;// Devuelve el primer usuario encontrado
    }
}