const { getUserById } = require('../models/userModel');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado', valid: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado', valid: false });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Error en la verificación del token:', err);
        return res.status(401).json({ message: 'Token inválido o expirado', valid: false });
    }
};
