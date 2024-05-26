const reviewModel = require('../models/reviewModel');
const jwt = require('jsonwebtoken');

// Crear review
exports.createReview = async (req, res) => {
    try {
        console.log('Entrando en createReview controller...');
        const { rating, description } = req.body;
        const tourId = req.params.tour_id;
        const token = req.header('Authorization')?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log('Data recibida:', req.body);
        console.log('User ID:', userId);
        console.log('Tour ID:', tourId);

        // Validar parámetros
        if (!rating || !description || !tourId) {
            return res.status(400).json({ message: 'Faltan parámetros requeridos' });
        }

        const result = await reviewModel.createReview(rating, description, tourId, userId);

        if (result.success) {
            console.log('Review creado exitosamente');
            res.status(201).json({ message: 'Review creado exitosamente' });
        } else {
            console.error('Error al crear review:', result.error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (err) {
        console.error('Error en createReview controller:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


// Actualizar una reseña
exports.updateReview = async (req, res) => {
    try {
        console.log('Entrando en updateReview controller...');
        const { review_id } = req.params;
        const { rating, description } = req.body;
        const token = req.header('Authorization')?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log('Data recibida:', req.body);
        console.log('User ID:', userId);
        console.log('Review ID:', review_id);

        // Validar parámetros
        if (!rating || !description) {
            return res.status(400).json({ message: 'Faltan parámetros requeridos' });
        }

        const result = await reviewModel.updateReview(review_id, rating, description, userId);

        if (result.success) {
            console.log('Reseña actualizada exitosamente');
            res.status(200).json({ message: 'Reseña actualizada exitosamente' });
        } else {
            console.error('Error al actualizar reseña:', result.error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (err) {
        console.error('Error en updateReview controller:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener reseñas por tour
exports.getReviewsByTour = async (req, res) => {
    try {
        console.log('Entrando en getReviewsByTour controller...');
        const { tour_id } = req.params;

        console.log('Tour ID:', tour_id);

        const reviews = await reviewModel.getReviewsByTour(tour_id);

        res.json(reviews);
    } catch (err) {
        console.error('Error en getReviewsByTour controller:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todas las reseñas
exports.getAllReviews = async (req, res) => {
    try {
        console.log('Entrando en getAllReviews controller...');

        const reviews = await reviewModel.getAllReviews();

        res.json(reviews);
    } catch (err) {
        console.error('Error en getAllReviews controller:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};