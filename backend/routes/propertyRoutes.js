const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Middleware para upload de imágenes
let upload;
try {
  upload = require('../middlewares/upload');
  console.log('✅ Upload middleware loaded');
} catch (error) {
  console.log('⚠️ Upload middleware not available, using simple handler');
  // Fallback simple si no está disponible
  upload = {
    array: () => (req, res, next) => {
      req.files = [];
      next();
    }
  };
}

// Middleware simple para logs
router.use((req, res, next) => {
  console.log(`🏠 Property Route: ${req.method} ${req.url}`);
  next();
});

// Crear propiedad (con soporte para imágenes)
router.post('/', upload.array('images', 5), (req, res, next) => {
  console.log('📤 POST /properties');
  propertyController.create(req, res);
});

// Obtener todas las propiedades
router.get('/', (req, res, next) => {
  console.log('📥 GET /properties');
  propertyController.getAll(req, res);
});

// Obtener una propiedad por ID
router.get('/:id', (req, res, next) => {
  console.log('📥 GET /properties/:id');
  propertyController.getById(req, res);
});

// Actualizar propiedad (con soporte para imágenes)
router.put('/:id', upload.array('images', 5), (req, res, next) => {
  console.log('📤 PUT /properties/:id');
  propertyController.update(req, res);
});

// Eliminar propiedad
router.delete('/:id', (req, res, next) => {
  console.log('🗑️ DELETE /properties/:id');
  propertyController.delete(req, res);
});

module.exports = router;
