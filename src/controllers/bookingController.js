const bookingModel = require('../models/bookingModel');
const jwt = require('jsonwebtoken');

// Crear una reserva con el pago correspondiente
exports.createBooking = async (req, res) => {
    try {
        const { tour_id, value, quota, card_number, cvc, request_payment, date } = req.body;
        const token = req.header('Authorization')?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log('Data recibida:', req.body);
        console.log('User ID:', userId);

        const paymentData = { value, quota, card_number, cvc, request_payment, date };
        const result = await bookingModel.createBooking(userId, tour_id, paymentData);

        if (result.success) {
            res.status(201).json({ message: 'Reserva creada exitosamente', bookingId: result.bookingId, paymentId: result.paymentId });
        } else {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error('Error en createBooking controller:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener un pago por ID
exports.getPaymentById = async (req, res) => {
    try {
        const { payment_id } = req.params;

        const payment = await bookingModel.getPaymentById(payment_id);

        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ message: 'Pago no encontrado' });
        }
    } catch (error) {
        console.error('Error en getPaymentById controller:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todos los pagos
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await bookingModel.getAllPayments();

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error en getAllPayments controller:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar un pago
exports.updatePayment = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const { value, quota, card_number, cvc, request_payment, date } = req.body;

        const result = await bookingModel.updatePayment(payment_id, value, quota, card_number, cvc, request_payment, date);

        if (result.success) {
            res.status(200).json({ message: 'Pago actualizado exitosamente' });
        } else {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error('Error en updatePayment controller:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar un pago
exports.deletePayment = async (req, res) => {
    try {
        const { payment_id } = req.params;

        const result = await bookingModel.deletePayment(payment_id);

        if (result.success) {
            res.status(200).json({ message: 'Pago eliminado exitosamente' });
        } else {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error('Error en deletePayment controller:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};