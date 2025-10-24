// models/UsuarioSistema.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

console.log("Sequelize importado:", sequelize.constructor.name);

const UsuarioSistema = sequelize.define('UsuarioSistema', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash' // 👈 mapeo a la columna real
  },
  nombreCompleto: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'nombre_completo'
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimoAcceso: {
    type: DataTypes.DATE,
    field: 'ultimo_acceso'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuarios_sistema',
  timestamps: false // ya tienes triggers para updated_at
});

export default UsuarioSistema;
