const db = require('../config/database');

class Medicion {
  static async crear(datos) {
    const { medidor_id, lectura_anterior, lectura_actual, periodo, fecha_lectura, observaciones, leido_por } = datos;
    const query = \`
      INSERT INTO mediciones 
      (medidor_id, lectura_anterior, lectura_actual, periodo, fecha_lectura, observaciones, leido_por)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    \`;
    const values = [medidor_id, lectura_anterior, lectura_actual, periodo, fecha_lectura, observaciones, leido_por];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async obtenerPorId(id) {
    const query = \`
      SELECT m.*, med.numero_medidor, u.nombres, u.apellidos
      FROM mediciones m
      JOIN medidores med ON m.medidor_id = med.id
      JOIN usuarios u ON med.usuario_id = u.id
      WHERE m.id = $1
    \`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async actualizar(id, datos) {
    const { lectura_actual, fecha_lectura, observaciones } = datos;
    const query = \`
      UPDATE mediciones 
      SET lectura_actual = $1, fecha_lectura = $2, observaciones = $3
      WHERE id = $4
      RETURNING *
    \`;
    const values = [lectura_actual, fecha_lectura, observaciones, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async eliminar(id) {
    const query = 'DELETE FROM mediciones WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Medicion;
