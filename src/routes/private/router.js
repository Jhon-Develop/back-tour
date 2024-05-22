const express = require('express');
// const userRoutes = require('./userRoutes');
const tourRoutes = require('./tourRoutes');
const commentRoutes = require('./commentRoutes');
const reviewRoutes = require('./reviewRoutes');
const bookingRoutes = require('./bookingRoutes')

const router = express.Router();

// Rutas para usuarios
// router.use('/users', userRoutes);

// Rutas para tours
router.use('/tours', tourRoutes);

// Rutas para comentarios
router.use('/comments', commentRoutes);

// Rutas para reviews
router.use('/reviews', reviewRoutes);

// Rutas para bookings
router.use('/bookings', bookingRoutes)

module.exports = router;
