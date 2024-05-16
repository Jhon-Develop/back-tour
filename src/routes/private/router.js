// private/routes.js
const express = require('express');
const userRoutes = require('./userRoutes');
const tourRoutes = require('./tourRoutes');

const router = express.Router();

// Rutas para usuarios
router.use('/users', userRoutes);

// Rutas para tours
router.use('/tours', tourRoutes);

module.exports = router;
