const jwt = require('jsonwebtoken');

exports.loginController = (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  
  console.log('Email received:', email);
  console.log('Password received:', password);
  
  // Credenciales simples - exactamente lo que esperas
  if (email === 'admin@inmobiliaria.com' && password === 'password') {
    console.log('✅ Credentials match! Creating token...');
    
    const token = jwt.sign(
      { 
        id: 1, 
        email: email, 
        role: 'admin' 
      },
      'secreto_inmobiliaria',
      { expiresIn: '24h' }
    );
    
    const userData = {
      id: 1,
      name: 'Administrador',
      email: email,
      role: 'admin'
    };
    
    console.log('✅ Login successful! Sending response...');
    return res.status(200).json({ 
      success: true,
      user: userData, 
      token: token 
    });
  }
  
  console.log('❌ Credentials do not match');
  console.log('Expected: admin@inmobiliaria.com / password');
  console.log('Received:', email, '/', password);
  
  return res.status(401).json({ 
    success: false,
    message: 'Credenciales incorrectas' 
  });
};
