import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


// Prueba de conexión
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Error de conexión:', err);
    } else {
      console.log('✅ Conectado a PostgreSQL, hora actual:', res.rows[0]);
    }
    pool.end();
  });
  