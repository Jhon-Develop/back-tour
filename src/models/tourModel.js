const { pool } = require('../config/database');

exports.createTour = async (name, description, city, available, price, rating, date, capacity, userId, tourCategoryId) => {
    try {
        const query = `
        INSERT INTO tours (name, description, city, available, price, rating, date, capacity, user_id, tour_category_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await pool.execute(query, [
            name || null,
            description || null,
            city || null,
            available !== undefined ? available : null,
            price !== undefined ? price : null,
            rating || null,
            date || null,
            capacity !== undefined ? capacity : null,
            userId || null,
            tourCategoryId || null
        ]);
        console.log('Resultado:', result);
        return { success: true, tourId: result.insertId };
    } catch (error) {
        console.error('Error al crear tour:', error);
        return { success: false, error };
    }
};

exports.getTourById = async (id) => {
    try {
        const query = `SELECT * FROM tours WHERE tour_id = ?`;
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
        const fields = Object.keys(newData).map(field => `${field} = ?`).join(', ');
        const values = Object.values(newData);

        const query = `
        UPDATE tours 
        SET ${fields}
        WHERE tour_id = ?;
        `;
        const [result] = await pool.execute(query, [...values, id]);
        console.log('Resultado:', result);
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar tour:', error);
        return { success: false, error };
    }
};

exports.deleteTour = async (id) => {
    try {
        const query = `DELETE FROM tours WHERE tour_id = ?`;
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

exports.ensureCategoryExists = async (categoryName) => {
    try {
        if (typeof categoryName === 'undefined') {
            throw new Error('El nombre de la categoría no debe ser undefined');
        }

        let query = `SELECT tour_category_id FROM tour_categories WHERE name = ?`;
        let [rows] = await pool.execute(query, [categoryName]);

        if (rows.length > 0) {
            return { success: true, categoryId: rows[0].tour_category_id };
        }

        query = `INSERT INTO tour_categories (name) VALUES (?)`;
        const [result] = await pool.execute(query, [categoryName]);
        const categoryId = result.insertId;

        return { success: true, categoryId };
    } catch (error) {
        console.error('Error al validar o crear la categoría del tour:', error);
        return { success: false, error };
    }
};
