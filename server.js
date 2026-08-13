require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rubrica_evaluacion',
  waitForConnections: true,
  connectionLimit: 10,
});

function sharedFlag(v) {
  return v === 'true' || v === true || v === '1' || v === 1 ? 1 : 0;
}

// Salud del servicio
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Listar claves (equivalente a window.storage.list)
app.get('/api/storage', async (req, res) => {
  try {
    const shared = sharedFlag(req.query.shared);
    const prefix = req.query.prefix || '';
    const [rows] = await pool.query(
      'SELECT k FROM kv_store WHERE shared = ? AND k LIKE ? ORDER BY k',
      [shared, prefix + '%']
    );
    res.json({ keys: rows.map((r) => r.k), prefix: req.query.prefix || undefined, shared: !!shared });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Leer una clave (equivalente a window.storage.get)
app.get('/api/storage/:key', async (req, res) => {
  try {
    const shared = sharedFlag(req.query.shared);
    const [rows] = await pool.query(
      'SELECT v FROM kv_store WHERE k = ? AND shared = ?',
      [req.params.key, shared]
    );
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json({ key: req.params.key, value: rows[0].v, shared: !!shared });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Escribir una clave (equivalente a window.storage.set)
app.put('/api/storage/:key', async (req, res) => {
  try {
    const shared = sharedFlag(req.body.shared);
    const value = req.body.value;
    await pool.query(
      `INSERT INTO kv_store (k, shared, v) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE v = VALUES(v), updated_at = CURRENT_TIMESTAMP`,
      [req.params.key, shared, value]
    );
    res.json({ key: req.params.key, value, shared: !!shared });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Borrar una clave (equivalente a window.storage.delete)
app.delete('/api/storage/:key', async (req, res) => {
  try {
    const shared = sharedFlag(req.query.shared);
    await pool.query('DELETE FROM kv_store WHERE k = ? AND shared = ?', [req.params.key, shared]);
    res.json({ key: req.params.key, deleted: true, shared: !!shared });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API de la rúbrica escuchando en http://localhost:${PORT}`));
