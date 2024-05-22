const express = require('express');
const bookingController = require('../../controllers/bookingController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, bookingController.createBooking);
router.put('/payments/:payment_id', authMiddleware, bookingController.updatePayment);
router.get('/payments/:payment_id', authMiddleware, bookingController.getPaymentById);
router.get('/payments', authMiddleware, bookingController.getAllPayments);
router.delete('/payments/:payment_id', authMiddleware, bookingController.deletePayment);

module.exports = router;
