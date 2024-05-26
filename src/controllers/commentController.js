const commentModel = require('../models/commentModel');
const jwt = require('jsonwebtoken');

// Crear comentario base
exports.createBaseComment = async (req, res) => {
    try {
        console.log('Entrando en createBaseComment controller...');
        const { name, description } = req.body;
        const token = req.header('Authorization')?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log('Data recibida:', req.body);
        console.log('User ID:', userId);

        // Validar parámetros
        if (!name || !description) {
            return res.status(400).json({ message: 'Faltan parámetros requeridos' });
        }

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const result = await commentModel.createComment(name, description, userId, null);
        
        if (result.success) {
            console.log('Comentario creado exitosamente');
            res.status(201).json({ message: 'Comentario creado exitosamente' });
        } else {
            console.error('Error al crear comentario:', result.error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (err) {
        console.error('Error en createBaseComment controller:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


// Crear respuesta a un comentario
exports.createResponseComment = async (req, res) => {
    try {
        console.log('Entrando en createResponseComment controller...');
        const { name, description } = req.body;
        const token = req.header('Authorization')?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log('Data recibida:', req.body);
        console.log('User ID:', userId);

        // Obtener el comment_id del comentario padre
        const { comment_id } = req.params;

        console.log('Comment ID:', comment_id);

        // Validar parámetros
        if (!name || !description || !comment_id) {
            return res.status(400).json({ message: 'Faltan parámetros requeridos' });
        }

        // Aquí deberías llamar a la función en el modelo para crear la respuesta al comentario
        const result = await commentModel.createComment(name, description, userId, comment_id);

        if (result.success) {
            console.log('Respuesta creada exitosamente');
            res.status(201).json({ message: 'Respuesta creada exitosamente' });
        } else {
            console.error('Error al crear respuesta:', result.error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (err) {
        console.error('Error en createResponseComment controller:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


// Obtener todos los comentarios
exports.getAllComments = async (req, res) => {
    try {
        console.log('Entrando en getAllComments controller...');
        const comments = await commentModel.getAllComments();
        res.json(comments);
    } catch (err) {
        console.error('Error en getAllComments controller:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener comentario por ID
exports.getCommentById = async (req, res) => {
    try {
        console.log('Entrando en getCommentById controller...');
        const { id } = req.params;
        console.log('Comment ID:', id);

        const comment = await commentModel.getCommentById(id);
        if (comment) {
            console.log('Comentario encontrado:', comment);
            res.json(comment);
        } else {
            console.log('Comentario no encontrado');
            res.status(404).json({ message: 'Comentario no encontrado' });
        }
    } catch (err) {
        console.error('Error al obtener comentario por ID:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar comentario
exports.updateComment = async (req, res) => {
    try {
        console.log('Entrando en updateComment controller...');
        const { id } = req.params;
        const { name, description } = req.body;
        console.log('Data recibida:', req.body);

        const result = await commentModel.updateComment(id, name, description);
        
        if (result.success) {
            console.log('Comentario actualizado exitosamente');
            res.json({ message: 'Comentario actualizado exitosamente' });
        } else {
            console.error('Error al actualizar comentario:', result.error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (err) {
        console.error('Error al actualizar comentario:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar comentario
exports.deleteComment = async (req, res) => {
    try {
        console.log('Entrando en deleteComment controller...');
        const { id } = req.params;
        console.log('Comment ID:', id);

        const result = await commentModel.deleteComment(id);
        if (result.success) {
            console.log('Comentario eliminado exitosamente');
            res.json({ message: 'Comentario eliminado exitosamente' });
        } else {
            console.error('Error al eliminar comentario:', result.error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (err) {
        console.error('Error al eliminar comentario:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar respuesta a un comentario
exports.updateResponseComment = async (req, res) => {
    try {
        console.log('Entrando en updateResponseComment controller...');
        const { id } = req.params;
        const { name, description } = req.body;
        console.log('Data recibida:', req.body);

        const result = await commentModel.updateResponseComment(id, name, description);

        if (result.success) {
            console.log('Respuesta actualizada exitosamente');
            res.json({ message: 'Respuesta actualizada exitosamente' });
        } else {
            console.error('Error al actualizar respuesta:', result.error);
            res.status(500).json({ message: 'Error en el servidor o respuesta no encontrada' });
        }
    } catch (err) {
        console.error('Error al actualizar respuesta:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
