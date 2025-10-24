const db = require('../config/database');

class Medidor {
  static async crear(datos) {
    const { numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial } = datos;
    const query = `
      INSERT INTO medidores 
      (numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial, estado)
      VALUES ($1, $2, $3, $4, $5, $6, 'activo')
      RETURNING *
    `;
    const values = [numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial || 0];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async obtenerTodos(filtros = {}) {
    let query = `
      SELECT m.*, u.numero_usuario, u.nombres, u.apellidos, u.direccion
      FROM medidores m
      LEFT JOIN usuarios u ON m.usuario_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filtros.usuario_id) {
      query += \` AND m.usuario_id = $\${paramCount}\`;
      values.push(filtros.usuario_id);
      paramCount++;
    }

    if (filtros.estado) {
      query += \` AND m.estado = $\${paramCount}\`;
      values.push(filtros.estado);
      paramCount++;
    }

    query += ' ORDER BY m.numero_medidor';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async obtenerPorId(id) {
    const query = \`
      SELECT m.*, u.numero_usuario, u.nombres, u.apellidos, u.direccion
      FROM medidores m
      LEFT JOIN usuarios u ON m.usuario_id = u.id
      WHERE m.id = $1
    \`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async actualizar(id, datos) {
    const { marca, modelo, estado, usuario_id } = datos;
    const query = \`
      UPDATE medidores 
      SET marca = $1, modelo = $2, estado = $3, usuario_id = $4
      WHERE id = $5
      RETURNING *
    \`;
    const values = [marca, modelo, estado, usuario_id, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async eliminar(id) {
    const query = 'DELETE FROM medidores WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Medidor;
