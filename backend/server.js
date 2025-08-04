const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://b1dc8ff626544c179fc50b5780244ef8-ae7c38b6040c4abcbd2f8ff1b.fly.dev'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging detallado
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  console.log('---');
  next();
});

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a la base de datos
const sequelize = require('./config/db');
sequelize.authenticate()
  .then(() => console.log('Conexión a MySQL exitosa'))
  .catch(err => {
    console.error('Error de conexión a MySQL:', err);
    console.log('Continuando sin base de datos - usando datos de prueba');
  });

// Sincronizar modelos solo si la conexión a la BD es exitosa
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a MySQL exitosa - modelos disponibles');
    require('./models'); // Importa y define relaciones
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Modelos sincronizados con la base de datos'))
  .catch(err => {
    console.error('Error al sincronizar modelos:', err);
    console.log('Servidor funcionando sin base de datos - usando datos de prueba únicamente');
  });

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Inmobiliaria Leal funcionando');
});

// Ruta de prueba para el API
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Backend API is working', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Body:', req.body);
  res.status(500).json({ message: 'Error interno del servidor', error: error.message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
