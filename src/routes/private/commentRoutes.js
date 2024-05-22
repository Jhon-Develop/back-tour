const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const commentsController = require('../../controllers/commentController');

// Ruta para crear comentario base
router.post('/', authMiddleware, commentsController.createBaseComment);

// Ruta para crear respuesta a un comentario
router.post('/:comment_id/reply', authMiddleware, commentsController.createResponseComment);

router.get('/', authMiddleware, commentsController.getAllComments);
router.get('/:id', authMiddleware, commentsController.getCommentById);
router.put('/:id', authMiddleware, commentsController.updateComment);
router.delete('/:id', authMiddleware, commentsController.deleteComment);

module.exports = router;
