const db = require('../config/database');

class Factura {
  static async eliminar(id) {
    const query = 'DELETE FROM facturas WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Factura;
