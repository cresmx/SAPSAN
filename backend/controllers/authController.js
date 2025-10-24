import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsuarioSistema from '../models/UsuarioSistema.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Normalizar username
    const normalizedUsername = username.trim().toLowerCase();

    const user = await UsuarioSistema.findOne({
      where: { username: normalizedUsername },
      raw: true
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Incluyo rol en la respuesta para el frontend
    res.json({ accessToken: token, rol: user.rol });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
