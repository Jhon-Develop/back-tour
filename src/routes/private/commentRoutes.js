const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const commentsController = require('../../controllers/commentController');


router.post('/', authMiddleware, commentsController.createBaseComment);
router.post('/:comment_id/reply', authMiddleware, commentsController.createResponseComment);
router.put('/reply/:id', authMiddleware, commentsController.updateResponseComment);
router.get('/', authMiddleware, commentsController.getAllComments);
router.get('/:id', authMiddleware, commentsController.getCommentById);
router.put('/:id', authMiddleware, commentsController.updateComment);
router.delete('/:id', authMiddleware, commentsController.deleteComment);

module.exports = router;
