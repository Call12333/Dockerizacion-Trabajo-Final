import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRoutes from './server/routes/api';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Requerido para sesiones detrás de proxies (como en Docker o Cloud Run)
  app.set('trust proxy', 1);

  // Middlewares básicos
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configuración de sesión optimizada para el entorno
  app.use(session({
    secret: process.env.SESSION_SECRET || 'cyberblue-y2k-secret-key-2004',
    resave: false,
    saveUninitialized: false,
    name: 'cyberblue.sid', // Nombre personalizado para la cookie
    cookie: {
      secure: false, // Debe ser false si no se usa HTTPS directamente en el nodo
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  }));

  // Rutas de la API
  app.use('/api', apiRoutes);

  // Integración con Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
