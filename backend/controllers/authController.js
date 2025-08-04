const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Usuarios de prueba para cuando la base de datos no esté disponible
const testUsers = [
  {
    id: 1,
    name: 'Admin Usuario',
    email: 'admin@inmobiliaria.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  },
  {
    id: 2,
    name: 'Super Admin',
    email: 'superadmin@inmobiliaria.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'super_admin'
  }
];

exports.loginController = async (req, res) => {
  console.log('=== LOGIN REQUEST RECEIVED ===');
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  const { email, password } = req.body;

  try {
    let user = null;

    try {
      // Intenta importar y usar el modelo User
      const { User } = require('../models');
      user = await User.findOne({ where: { email } });
    } catch (dbError) {
      console.log('Base de datos no disponible, usando usuarios de prueba');
      // Si la BD no está disponible, usa los usuarios de prueba
      user = testUsers.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Compara la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Genera el token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '8h' }
    );

    // Devuelve el usuario (sin la contraseña) y el token
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({ user: userData, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
