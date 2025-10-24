const db = require('../config/database');

class Usuario {
  static async eliminar(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Usuario;
