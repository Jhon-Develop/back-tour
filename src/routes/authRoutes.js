const express = require('express')
const { register, login, verifyToken, getAll} = require('../controllers/authController');

const router = express.Router();

router.use('/login', login);
router.post('/register', register);
router.get('/verify-token', verifyToken)
router.get('/getAll', getAll)

module.exports = router;