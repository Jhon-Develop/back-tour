const { pool } = require('../config/database');

exports.createTour = async (capacity, title, price, description, city, rating, avalibility, userId) => {
    try {
        const query = `
            INSERT INTO tours (capacity, title, price, description, city, rating, availability, userId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await pool.execute(query, [capacity, title, price, description, city, rating, avalibility, userId]);
        console.log('Resultado:', result);
        return { success: true, tourId: result.insertId };
    } catch (error) {
        console.error('Error al crear tour:', error);
        return { success: false, error };
    }
};

exports.getTourById = async (id) => {
    try {
        const query = `SELECT * FROM tours WHERE id = ?`;
        const [rows] = await pool.execute(query, [id]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener tour por ID:', error);
        throw error;
    }
};

exports.updateTour = async (id, newData) => {
    try {
        const { capacity, title, price, description, city, rating, availability } = newData;
        const query = `
            UPDATE tours 
            SET capacity = ?, title = ?, price = ?, description = ?, city = ?, rating = ?, availability = ? 
            WHERE id = ?;
        `;
        const [result] = await pool.execute(query, [capacity, title, price, description, city, rating, availability, id]);
        console.log('Resultado:', result);
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar tour:', error);
        return { success: false, error };
    }
};

exports.deleteTour = async (id) => {
    try {
        const query = `DELETE FROM tours WHERE id = ?`;
        const [result] = await pool.execute(query, [id]);
        console.log('Resultado:', result);
        return { success: true };
    } catch (error) {
        console.error('Error al eliminar tour:', error);
        return { success: false, error };
    }
};

exports.getAllTours = async () => {
    try {
        const query = `SELECT * FROM tours`;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener todos los tours:', error);
        throw error;
    }
};

