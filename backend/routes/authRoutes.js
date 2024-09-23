const express = require('express');
const { loginProducer, registerProducer } = require('../controllers/authController');
const router = express.Router();

// Rota para login de produtor
router.post('/login', loginProducer);

// Rota para registro de novo produtor
router.post('/register', registerProducer);

module.exports = router;
