const express = require('express');
const router = express.Router();
const tourController = require('../../controllers/tourController');
const authMiddleware = require('../../middlewares/authMiddleware');


router.post('/', authMiddleware, tourController.createTour);
router.get('/:id', authMiddleware, tourController.getTourById);
router.put('/:id', authMiddleware, tourController.updateTour);
router.delete('/:id', authMiddleware, tourController.deleteTour);
router.get('/', authMiddleware, tourController.getAllTours);

module.exports = router;
