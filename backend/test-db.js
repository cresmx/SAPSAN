// test-db.js
import db from './config/database.js';

db.query('SELECT NOW()')
  .then(res => {
    console.log('Conexión OK:', res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error en conexión:', err);
    process.exit(1);
  });
