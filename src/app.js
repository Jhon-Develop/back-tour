require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/public/authRoutes');
const tourRoutes = require('./routes/private/tourRoutes'); // Corrige la ruta a las rutas de tours

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/auth/tours', tourRoutes); // Agrega las rutas de tours bajo /api/auth/tours

module.exports = app;

