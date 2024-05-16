const express = require('express')
const { register, login, verifyToken, getAllUsers} = require('../../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify-token', verifyToken)
router.get('/getAll', getAllUsers)

module.exports = router;