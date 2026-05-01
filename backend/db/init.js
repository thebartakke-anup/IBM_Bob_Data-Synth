import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'data-synth.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database schema
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          filename TEXT,
          status TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Error creating sessions table:', err.message);
          reject(err);
        } else {
          console.log('Sessions table created/verified');
        }
      });

      // Create schemas table
      db.run(`
        CREATE TABLE IF NOT EXISTS schemas (
          id TEXT PRIMARY KEY,
          session_id TEXT,
          columns TEXT,
          confidence_scores TEXT,
          FOREIGN KEY(session_id) REFERENCES sessions(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating schemas table:', err.message);
          reject(err);
        } else {
          console.log('Schemas table created/verified');
        }
      });

      // Create audit_log table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          action TEXT,
          details TEXT,
          FOREIGN KEY(session_id) REFERENCES sessions(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating audit_log table:', err.message);
          reject(err);
        } else {
          console.log('Audit log table created/verified');
          resolve();
        }
      });
    });
  });
}

export default db;

// Made with Bob
