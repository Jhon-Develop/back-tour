const { pool } = require('../config/database');

// Crear review
exports.createReview = async (rating, description, tourId, userId) => {
    try {
        const [result] = await pool.query(`
            INSERT INTO tour_reviews (rating, description, tour_id, user_id)
            VALUES (?, ?, ?, ?)
        `, [rating, description, tourId, userId]);

        return { success: true, insertId: result.insertId };
    } catch (error) {
        console.error('Error al crear review:', error);
        return { success: false, error };
    }
};


// Actualizar una reseña
exports.updateReview = async (review_id, rating, description, user_id) => {
    try {
        const [result] = await pool.execute(`
            UPDATE tour_reviews 
            SET rating = ?, description = ? 
            WHERE tour_review_id = ? AND user_id = ?
        `, [rating, description, review_id, user_id]);

        return { success: true };
    } catch (error) {
        console.error('Error en updateReview:', error);
        return { success: false, error };
    }
};

// Obtener reseñas por tour
exports.getReviewsByTour = async (tour_id) => {
    try {
        const [reviews] = await pool.execute(`
            SELECT * FROM tour_reviews WHERE tour_id = ?
        `, [tour_id]);

        return reviews;
    } catch (error) {
        console.error('Error en getReviewsByTour:', error);
        throw error;
    }
};

// Obtener todas las reseñas
exports.getAllReviews = async () => {
    try {
        const [reviews] = await pool.execute(`
            SELECT * FROM tour_reviews
        `);

        return reviews;
    } catch (error) {
        console.error('Error al obtener todas las reviews:', error);
        throw error;
    }
};