const { Sequelize } = require('sequelize');

// Configuración para Supabase PostgreSQL
const sequelize = new Sequelize(
  process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'postgres'}`,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
