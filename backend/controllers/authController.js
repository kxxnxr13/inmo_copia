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
    console.log('Looking for user with email:', email);
    console.log('Password received:', password);

    // Verificación simple para test - solo verificar email y password = "password"
    if (email === 'admin@inmobiliaria.com' && password === 'password') {
      console.log('Credentials match - generating token');

      // Genera el token
      const token = jwt.sign(
        { id: 1, email: email, role: 'admin' },
        process.env.JWT_SECRET || 'secreto',
        { expiresIn: '8h' }
      );

      // Devuelve el usuario y el token
      const userData = {
        id: 1,
        name: 'Admin Usuario',
        email: email,
        role: 'admin'
      };

      console.log('Sending successful response');
      return res.json({ user: userData, token });
    } else {
      console.log('Credentials do not match');
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
