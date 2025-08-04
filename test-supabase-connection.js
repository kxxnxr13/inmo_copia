const { Sequelize } = require('sequelize');

const DATABASE_URL = "postgresql://postgres:Keiner*13***@db.hsgvipzswbanogfnxlyo.supabase.co:5432/postgres";

console.log('🚀 Testing Supabase connection...');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 30000,
    socketTimeout: 30000,
    family: 4
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to Supabase successful!');
    
    // Test a simple query
    const result = await sequelize.query('SELECT NOW() as current_time');
    console.log('✅ Query test successful:', result[0][0]);
    
    await sequelize.close();
    console.log('🔐 Connection closed');
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.error('Details:', error);
  }
}

testConnection();
