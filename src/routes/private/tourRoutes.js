const express = require('express');
const router = express.Router();
const tourController = require('../../controllers/tourController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/tours', authMiddleware, tourController.createTour);
router.get('/tours/:id', authMiddleware, tourController.getTourById);
router.put('/tours/:id', authMiddleware, tourController.updateTour);
router.delete('/tours/:id', authMiddleware, tourController.deleteTour);
router.get('/tours', authMiddleware, tourController.getAllTours); // Nueva ruta para obtener todos los tours

module.exports = router;
