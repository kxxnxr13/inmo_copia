const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Middleware simple para logs
router.use((req, res, next) => {
  console.log(`📞 Contact Route: ${req.method} ${req.url}`);
  next();
});

// Crear solicitud de contacto (PÚBLICO - sin autenticación)
router.post('/', (req, res, next) => {
  console.log('📤 POST /contacts - Public contact form');
  contactController.create(req, res);
});

// Las siguientes rutas requieren autenticación (para administradores)
// Por ahora las dejo simples para testing

// Obtener todas las solicitudes de contacto
router.get('/', (req, res, next) => {
  console.log('📥 GET /contacts');
  contactController.getAll(req, res);
});

// Obtener una solicitud por ID
router.get('/:id', (req, res, next) => {
  console.log('📥 GET /contacts/:id');
  contactController.getById(req, res);
});

// Actualizar solicitud
router.put('/:id', (req, res, next) => {
  console.log('📤 PUT /contacts/:id');
  contactController.update(req, res);
});

// Eliminar solicitud
router.delete('/:id', (req, res, next) => {
  console.log('🗑️ DELETE /contacts/:id');
  contactController.delete(req, res);
});

module.exports = router;
