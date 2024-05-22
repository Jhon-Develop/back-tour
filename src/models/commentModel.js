const { pool } = require('../config/database');

// Crear un comentario
exports.createComment = async (name, description, user_id, answer_id) => {
    try {
        const query = `
            INSERT INTO comments (name, description, user_id, answer_id) 
            VALUES (?, ?, ?, ?)
        `;
        // Verificamos que todos los valores no sean undefined, si es undefined lo convertimos a null
        const [result] = await pool.execute(query, [
            name || null,
            description || null,
            user_id !== undefined ? user_id : null,
            answer_id !== undefined ? answer_id : null
        ]);
        return { success: true, commentId: result.insertId };
    } catch (error) {
        console.error('Error al crear comentario:', error);
        return { success: false, error };
    }
};

// Obtener todos los comentarios
exports.getAllComments = async () => {
    try {
        const query = `SELECT * FROM comments`;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener todos los comentarios:', error);
        throw error;
    }
};

// Obtener comentario por ID
exports.getCommentById = async (id) => {
    try {
        const query = `SELECT * FROM comments WHERE comment_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error al obtener comentario por ID:', error);
        throw error;
    }
};

// Actualizar comentario
exports.updateComment = async (id, name, description) => {
    try {
        const query = `
            UPDATE comments 
            SET name = ?, description = ? 
            WHERE comment_id = ?
        `;
        await pool.execute(query, [name, description, id]);
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar comentario:', error);
        return { success: false, error };
    }
};

// Eliminar comentario
exports.deleteComment = async (id) => {
    try {
        const query = `DELETE FROM comments WHERE comment_id = ?`;
        await pool.execute(query, [id]);
        return { success: true };
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        return { success: false, error };
    }
};