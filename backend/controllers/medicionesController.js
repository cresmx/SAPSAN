import sequelize from '../config/sequelize.js';
import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento para fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/mediciones'); // asegúrate de crear esta carpeta
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

// Obtener mediciones por domicilio
export const getMedicionesByDomicilio = async (req, res) => {
  try {
    const { id } = req.params; // domicilio_id
    const { limit = 12 } = req.query;

    const [rows] = await sequelize.query(
      `SELECT m.*, f.numero_factura, f.total, f.estado as estado_factura
       FROM mediciones m
       LEFT JOIN facturas f ON m.id = f.medicion_id
       WHERE m.domicilio_id = $1
       ORDER BY m.fecha_lectura DESC
       LIMIT $2`,
      { bind: [id, limit] }
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener mediciones:', error);
    res.status(500).json({ error: true, message: 'Error al obtener mediciones' });
  }
};

// Registrar nueva medición
export const createMedicion = async (req, res) => {
  try {
    const { domicilio_id, lectura_actual, periodo, observaciones, gps_lat, gps_lng } = req.body;
    const foto_url = req.file ? `/uploads/mediciones/${req.file.filename}` : null;

    if (!domicilio_id || !lectura_actual || !periodo) {
      return res.status(400).json({ error: true, message: 'Faltan campos requeridos' });
    }

    // Buscar medidor activo del domicilio
    const [medidorRows] = await sequelize.query(
      `SELECT id FROM medidores WHERE domicilio_id = $1 AND estado = 'activo' LIMIT 1`,
      { bind: [domicilio_id] }
    );

    if (medidorRows.length === 0) {
      return res.status(400).json({ error: true, message: 'No hay medidor activo para este domicilio' });
    }

    const medidorId = medidorRows[0].id;

    // Obtener lectura anterior
    const [prev] = await sequelize.query(
      `SELECT lectura_actual FROM mediciones 
       WHERE medidor_id = $1 
       ORDER BY fecha_lectura DESC LIMIT 1`,
      { bind: [medidorId] }
    );
    const lectura_anterior = prev.length > 0 ? prev[0].lectura_actual : 0;

    // Insertar nueva medición con medidor_id
    const [rows] = await sequelize.query(
      `INSERT INTO mediciones (medidor_id, domicilio_id, lectura_anterior, lectura_actual, periodo, fecha_lectura, observaciones, foto_url, gps_lat, gps_lng, leido_por)
       VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,$6,$7,$8,$9,$10)
       RETURNING *`,
      {
        bind: [
          medidorId,
          domicilio_id,
          lectura_anterior,
          lectura_actual,
          periodo,
          observaciones || null,
          foto_url,
          gps_lat || null,
          gps_lng || null,
          req.user?.id || null
        ]
      }
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al crear medición:', error);
    res.status(500).json({ error: true, message: 'Error al crear medición' });
  }
};
