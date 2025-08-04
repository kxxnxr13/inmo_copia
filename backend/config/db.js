const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'inmobiliaria_leal',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

module.exports = sequelize;
