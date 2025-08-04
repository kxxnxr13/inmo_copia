const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Usuarios de prueba en memoria (fallback)
let usersMemory = [
  {
    id: 1,
    name: 'Admin Usuario',
    email: 'admin@inmobiliaria.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye.Fq.TuE6IZFq6SoXCYdVwNqK./mDCgG', // admin123
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Super Admin',
    email: 'superadmin@inmobiliaria.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye.Fq.TuE6IZFq6SoXCYdVwNqK./mDCgG', // admin123
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextUserId = 3;

// Función para obtener el modelo User
const getUserModel = () => {
  try {
    const { User } = require('../models');
    return User;
  } catch (error) {
    console.log('⚠️ User model not available, using memory storage');
    return null;
  }
};

exports.register = async (req, res) => {
  console.log('👤 Creating user:', req.body);
  try {
    const { name, email, password, role } = req.body;
    const User = getUserModel();

    if (User) {
      try {
        console.log('💾 Attempting database user creation');
        const user = await User.create({ name, email, password, role });
        console.log('✅ User created in database:', user.email);
        res.status(201).json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          source: 'database'
        });
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
        // Fallback a memoria
        console.log('🧠 Creating user in memory as fallback');
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          id: nextUserId++,
          name,
          email,
          password: hashedPassword,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        usersMemory.push(newUser);
        console.log('✅ User created in memory:', newUser.email);
        res.status(201).json({
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
          },
          source: 'memory'
        });
      }
    } else {
      // Usar memoria (fallback)
      console.log('🧠 Creating user in memory');
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: nextUserId++,
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      usersMemory.push(newUser);
      console.log('✅ User created in memory:', newUser.email);
      res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        },
        source: 'memory'
      });
    }
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;
    const User = getUserModel();

    if (User) {
      try {
        console.log('💾 Attempting database login');
        user = await User.findOne({ where: { email } });
        if (user) {
          console.log('✅ User found in database:', user.email);
          if (!(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
          }
        } else {
          console.log('❌ User not found in database, checking memory');
        }
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
        user = null;
      }
    }

    // Si no se encontró en la base de datos, usar memoria
    if (!user) {
      console.log('🧠 Using memory authentication');
      user = usersMemory.find(u => u.email === email);
      if (user) {
        console.log('✅ User found in memory:', user.email);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secreto_inmobiliaria', { expiresIn: '1d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      source: User ? 'database' : 'memory'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  console.log('📋 Getting all users');
  try {
    const User = getUserModel();

    if (User) {
      try {
        console.log('💾 Fetching users from database');
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        console.log('✅ Users fetched from database:', users.length);
        return res.json({
          success: true,
          users: users,
          total: users.length,
          source: 'database'
        });
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
      }
    }

    // Usar memoria (fallback)
    console.log('🧠 Fetching users from memory');
    const usersWithoutPassword = usersMemory.map(({ password, ...user }) => user);
    console.log('✅ Users fetched from memory:', usersWithoutPassword.length);
    res.json({
      success: true,
      users: usersWithoutPassword,
      total: usersWithoutPassword.length,
      source: 'memory'
    });
  } catch (error) {
    console.error('❌ Error getting users:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('🔍 Looking for user with ID:', id);
    const User = getUserModel();

    if (User) {
      try {
        console.log('💾 Searching in database');
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        if (user) {
          console.log('✅ User found in database:', user.email);
          return res.json({
            success: true,
            user: user,
            source: 'database'
          });
        } else {
          console.log('❌ User not found in database, checking memory');
        }
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
      }
    }

    // Usar memoria (fallback)
    console.log('🧠 Searching in memory');
    const user = usersMemory.find(u => u.id === id);
    if (!user) {
      console.log('❌ User not found in memory with ID:', id);
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const { password, ...userWithoutPassword } = user;
    console.log('✅ User found in memory:', user.email);
    res.json({
      success: true,
      user: userWithoutPassword,
      source: 'memory'
    });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('📝 Updating user with ID:', id);
    const User = getUserModel();

    if (User) {
      try {
        console.log('💾 Attempting database update');
        const user = await User.findByPk(id);
        if (user) {
          await user.update(req.body);
          console.log('✅ User updated in database:', user.email);
          return res.json({
            success: true,
            message: 'Usuario actualizado en base de datos',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            },
            source: 'database'
          });
        } else {
          console.log('❌ User not found in database, trying memory');
        }
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
      }
    }

    // Usar memoria (fallback)
    console.log('🧠 Updating in memory');
    const userIndex = usersMemory.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Si hay contraseña nueva, hashearla
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = {
      ...usersMemory[userIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    usersMemory[userIndex] = updatedUser;
    const { password, ...userWithoutPassword } = updatedUser;
    console.log('✅ User updated in memory:', updatedUser.email);
    res.json({
      success: true,
      message: 'Usuario actualizado en memoria',
      user: userWithoutPassword,
      source: 'memory'
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('🗑️ Deleting user with ID:', id);
    const User = getUserModel();

    if (User) {
      try {
        console.log('💾 Attempting database deletion');
        const user = await User.findByPk(id);
        if (user) {
          await user.destroy();
          console.log('✅ User deleted from database:', id);
          return res.json({
            success: true,
            message: 'Usuario eliminado de la base de datos',
            source: 'database'
          });
        } else {
          console.log('❌ User not found in database, trying memory');
        }
      } catch (dbError) {
        console.error('❌ Database error, falling back to memory:', dbError.message);
      }
    }

    // Usar memoria (fallback)
    console.log('🧠 Deleting from memory');
    const userIndex = usersMemory.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    usersMemory.splice(userIndex, 1);
    console.log('✅ User deleted from memory:', id);
    res.json({
      success: true,
      message: 'Usuario eliminado de la memoria',
      source: 'memory'
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
