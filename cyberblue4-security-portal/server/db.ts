import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Inicializar tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    displayName TEXT,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Shield',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insertar servicios iniciales si la tabla está vacía
const servicesCount = db.prepare('SELECT count(*) as count FROM services').get() as { count: number };
if (servicesCount.count === 0) {
  const insert = db.prepare('INSERT INTO services (title, description, icon) VALUES (?, ?, ?)');
  insert.run('Endpoint Protection', 'Seguridad avanzada para dispositivos finales.', 'Shield');
  insert.run('Cloud Firewall', 'Filtrado de tráfico inteligente.', 'Lock');
  insert.run('Threat Intelligence', 'Análisis predictivo de amenazas.', 'Activity');
}

export default db;
