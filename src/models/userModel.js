const { pool } = require('../config/database');

// Crear usuario
exports.createUser = async (username, email, hashedPassword, roleId) => {
    try {
        const query = `
        INSERT INTO users (username, email, password, role_id) 
        VALUES (?, ?, ?, ?);
        `;
        const [result] = await pool.execute(query, [username, email, hashedPassword, roleId]);
        console.log('Resultado:', result);
        return { success: true };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return { success: false, error };
    }
};

// Obtener usuario por email
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

// Obtener todos los usuarios
exports.getAllUsers = async () => {
    try {
        const query = `SELECT * FROM users`;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw error;
    }
};

// Obtener rol por nombre
exports.getRoleByName = async (roleName) => {
    try {
        const query = `SELECT * FROM roles WHERE name = ?`;
        const [rows] = await pool.execute(query, [roleName]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener rol por nombre:', error);
        throw error;
    }
};

exports.getUserById = async (userId) => {
    try {
        const query = `SELECT * FROM users WHERE user_id = ?`;
        const [rows] = await pool.execute(query, [userId]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
};

// Actualizar usuario
exports.updateUser = async (userId, newData) => {
    try {
        const fields = Object.keys(newData).map(field => `${field} = ?`).join(', ');
        const values = Object.values(newData);

        const query = `
        UPDATE users 
        SET ${fields}
        WHERE user_id = ?;
        `;
        const [result] = await pool.execute(query, [...values, userId]);
        console.log('Resultado:', result);
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return { success: false, error };
    }
};

