const bcrypt = require('bcryptjs');

async function generateHash() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Hash for admin123:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare('admin123', hash);
    console.log('Hash validation:', isValid);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateHash();
