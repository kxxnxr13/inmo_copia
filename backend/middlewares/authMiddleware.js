const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('🔐 Auth middleware - checking token');
  console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No auth header or invalid format');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🎫 Token received (first 20 chars):', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_inmobiliaria');
    console.log('✅ Token verified successfully for user:', decoded.email || decoded.id);
    console.log('👤 User role:', decoded.role);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    console.log('Token error type:', error.name);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
