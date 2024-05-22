const express = require('express');
const authController = require('../../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-token', authController.verifyToken);
router.get('/users', authController.getAllUsers);
router.put('/users/:userId', authController.updateUser); // Ruta para actualizar usuario

module.exports = router;

