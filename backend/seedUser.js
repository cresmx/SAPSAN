// backend/seedUser.js
import bcrypt from 'bcrypt';
import sequelize from './config/sequelize.js';
import UsuarioSistema from './models/UsuarioSistema.js';

const seedUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida con la base de datos');

    const username = 'user_test';
    const password = '123456';
    const passwordHash = await bcrypt.hash(password, 10);

    // Buscar si ya existe
    let user = await UsuarioSistema.findOne({ where: { username } });

    if (user) {
      // Actualizar contraseña y rol si ya existe
      await user.update({ passwordHash, rol: 'usuario', activo: true });
      console.log(`🔄 Usuario "${username}" actualizado con contraseña "${password}"`);
    } else {
      // Crear nuevo usuario
      await UsuarioSistema.create({
        username,
        passwordHash,
        nombreCompleto: 'Usuario de Prueba',
        rol: 'usuario',
        email: 'user@test.com',
        activo: true
      });
      console.log(`✅ Usuario "${username}" creado con contraseña "${password}"`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear/actualizar usuario de prueba:', error);
    process.exit(1);
  }
};

seedUser();
