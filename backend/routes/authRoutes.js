const express = require('express');
const router = express.Router();
const { loginController } = require('../controllers/authController');

console.log('Auth routes loaded');

// Ruta de test
router.get('/test', (req, res) => {
  console.log('Auth test route hit');
  res.json({ message: 'Auth routes working', timestamp: new Date() });
});

// Ruta para login
router.post('/login', (req, res) => {
  console.log('POST /login route hit');
  loginController(req, res);
});

module.exports = router;
