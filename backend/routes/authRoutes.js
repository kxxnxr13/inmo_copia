const express = require('express');
const router = express.Router();
const { loginController } = require('../controllers/authController');

// Ruta de test
router.get('/test', (req, res) => {
  console.log('Auth test route accessed');
  res.json({ message: 'Auth routes working' });
});

// Ruta para login
router.post('/login', loginController);

module.exports = router;
