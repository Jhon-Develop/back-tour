require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/public/authRoutes');
const tourRoutes = require('./routes/private/tourRoutes');
const commentRoutes = require('./routes/private/commentRoutes');
const reviewRoutes = require('./routes/private/reviewRoutes');
const bookingRoutes = require('./routes/private/bookingRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas (sin autenticación)
app.use('/auth', authRoutes);

// Middleware de autenticación para todas las rutas privadas
app.use('/tours', authMiddleware, tourRoutes);
app.use('/comments', authMiddleware, commentRoutes);
app.use('/reviews', authMiddleware, reviewRoutes);
app.use('/bookings', authMiddleware, bookingRoutes);



module.exports = app;
