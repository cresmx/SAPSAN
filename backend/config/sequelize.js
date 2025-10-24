// backend/config/sequelize.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// 👇 Validación de debug
console.log("Tipo de export:", typeof sequelize);
console.log("Es instancia?:", sequelize instanceof Sequelize);
console.log("Tiene define?:", typeof sequelize.define);

export default sequelize;
