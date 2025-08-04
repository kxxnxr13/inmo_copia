const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Usuarios de prueba para cuando la base de datos no esté disponible (fallback)
const testUsers = [
  {
    id: 1,
    name: 'Admin Usuario',
    email: 'admin@inmobiliaria.com',
    password: '$2a$10$VYKZKj47JL6x.e7Rhr5GX.5NJ4V25CbdHXLfcJw1t2lqNr9E9O8.m', // admin123
    role: 'admin'
  },
  {
    id: 2,
    name: 'Super Admin',
    email: 'superadmin@inmobiliaria.com',
    password: '$2a$10$VYKZKj47JL6x.e7Rhr5GX.5NJ4V25CbdHXLfcJw1t2lqNr9E9O8.m', // admin123
    role: 'super_admin'
  }
];

// Función para obtener el modelo User
const getUserModel = () => {
  try {
    const { User } = require('../models');
    return User;
  } catch (error) {
    console.log('⚠️ User model not available, using test users');
    return null;
  }
};

exports.loginController = async (req, res) => {
  console.log('=== LOGIN REQUEST RECEIVED ===');
  console.log('Body:', req.body);
  const { email, password } = req.body;

  try {
    let user = null;
    const User = getUserModel();
    
    if (User) {
      // Intentar usar la base de datos real
      console.log('💾 Attempting database authentication');
      try {
        user = await User.findOne({ where: { email } });
        if (user) {
          console.log('✅ User found in database:', user.email);
        } else {
          console.log('❌ User not found in database, checking test users');
        }
      } catch (dbError) {
        console.error('❌ Database error, falling back to test users:', dbError.message);
        user = null;
      }
    }
    
    // Si no se encontró en la base de datos, usar usuarios de prueba
    if (!user) {
      console.log('🧠 Using test users authentication');
      user = testUsers.find(u => u.email === email);
      if (user) {
        console.log('✅ User found in test users:', user.email);
      }
    }

    if (!user) {
      console.log('❌ User not found anywhere');
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales incorrectas' 
      });
    }

    // Verificar la contraseña
    console.log('🔐 Verifying password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales incorrectas' 
      });
    }

    console.log('✅ Password verified successfully');

    // Generar el token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secreto_inmobiliaria',
      { expiresIn: '24h' }
    );

    // Preparar datos del usuario (sin contraseña)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('✅ Login successful for user:', userData.email);
    res.json({ 
      success: true,
      user: userData, 
      token: token,
      source: User ? 'database' : 'memory'
    });
  } catch (error) {
    console.error('❌ Error in login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};

// Función para crear usuario administrador inicial (solo si la BD está disponible)
exports.createInitialAdmin = async () => {
  try {
    const User = getUserModel();
    if (!User) {
      console.log('⚠️ User model not available, skipping admin creation');
      return;
    }

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@inmobiliaria.com' } 
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Crear admin inicial
    const hashedPassword = await bcrypt.hash('password', 10);
    await User.create({
      name: 'Admin Usuario',
      email: 'admin@inmobiliaria.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Initial admin user created successfully');
  } catch (error) {
    console.error('❌ Error creating initial admin:', error);
  }
};

// Función para poblar la base de datos con datos iniciales
exports.seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with initial data...');
    
    // Crear usuarios iniciales
    await exports.createInitialAdmin();
    
    // Aquí podrías agregar más datos iniciales si es necesario
    
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
