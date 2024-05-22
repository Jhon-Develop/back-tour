const express = require('express');
const reviewController = require('../../controllers/reviewController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/:tour_id/reviews', authMiddleware, reviewController.createReview);
router.put('/:review_id', authMiddleware, reviewController.updateReview);
router.get('/:tour_id/reviews', reviewController.getReviewsByTour);

module.exports = router;
