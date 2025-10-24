// backend/seedAdmin.js
import bcrypt from 'bcrypt';
import sequelize from './config/sequelize.js';
import UsuarioSistema from './models/UsuarioSistema.js';

const seedAdmin = async () => {
  try {
    // Conectar a la base
    await sequelize.authenticate();
    console.log('✅ Conexión establecida con la base de datos');

    const username = 'admin_test';
    const password = '123456';
    const passwordHash = await bcrypt.hash(password, 10);

    // Buscar si ya existe
    let admin = await UsuarioSistema.findOne({ where: { username } });

    if (admin) {
      // Actualizar contraseña y rol si ya existe
      await admin.update({ passwordHash, rol: 'admin', activo: true });
      console.log(`🔄 Usuario "${username}" actualizado con contraseña "${password}"`);
    } else {
      // Crear nuevo usuario
      await UsuarioSistema.create({
        username,
        passwordHash,
        nombreCompleto: 'Administrador de Prueba',
        rol: 'admin',
        email: 'admin@test.com',
        activo: true
      });
      console.log(`✅ Usuario "${username}" creado con contraseña "${password}"`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear/actualizar admin:', error);
    process.exit(1);
  }
};

seedAdmin();
