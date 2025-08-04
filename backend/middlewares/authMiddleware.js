const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_inmobiliaria');
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    console.log('JWT_SECRET being used:', process.env.JWT_SECRET || 'secreto_inmobiliaria');
    console.log('Error type:', error.name);
    return res.status(401).json({
      error: 'Token inválido - Por favor cierra sesión e inicia sesión nuevamente'
    });
  }
};

module.exports = authMiddleware;
