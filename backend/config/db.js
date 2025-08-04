const { Sequelize } = require('sequelize');

// Configuración para Supabase PostgreSQL
let sequelize;

// Configuración específica para Supabase
console.log('📡 Configuring Supabase PostgreSQL connection');
sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'db.hsgvipzswbanogfnxlyo.supabase.co',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 30000,
      socketTimeout: 30000,
      keepAlive: true,
      // Configuraciones específicas para Supabase
      statement_timeout: 30000,
      idle_in_transaction_session_timeout: 30000
    },
    pool: {
      max: 3,
      min: 0,
      acquire: 30000,
      idle: 10000,
      evict: 1000
    },
    retry: {
      match: [
        /ConnectionError/,
        /ConnectionRefused/,
        /ConnectionTimedOut/,
        /TimeoutError/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /EHOSTUNREACH/
      ],
      max: 2
    },
    // Configuraciones adicionales para Supabase
    define: {
      freezeTableName: true,
      timestamps: true
    }
  }
);

module.exports = sequelize;
