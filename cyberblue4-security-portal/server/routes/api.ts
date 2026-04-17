import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { protect, adminOnly } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Auth
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('displayName').notEmpty().trim()
], authController.register);

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/me', authController.getMe);

// Services (Equipos)
router.get('/services', protect, (req, res) => {
  const services = db.prepare('SELECT * FROM services ORDER BY title ASC').all();
  res.json(services);
});

router.post('/services', [protect, adminOnly], (req: any, res: any) => {
  const { title, description, icon } = req.body;
  const result = db.prepare('INSERT INTO services (title, description, icon) VALUES (?, ?, ?)')
    .run(title, description, icon || 'Shield');
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/services/:id', [protect, adminOnly], (req: any, res: any) => {
  const { title, description, icon } = req.body;
  db.prepare('UPDATE services SET title = ?, description = ?, icon = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
    .run(title, description, icon, req.params.id);
  res.json({ message: 'Servicio actualizado' });
});

router.delete('/services/:id', [protect, adminOnly], (req: any, res: any) => {
  db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  res.json({ message: 'Servicio eliminado' });
});

// Logs
router.get('/logs', [protect, adminOnly], (req, res) => {
  const logs = db.prepare(`
    SELECT logs.*, users.email as userEmail 
    FROM logs 
    JOIN users ON logs.userId = users.id 
    ORDER BY timestamp DESC LIMIT 20
  `).all();
  res.json(logs);
});

router.post('/logs', protect, (req: any, res: any) => {
  const { action, details } = req.body;
  db.prepare('INSERT INTO logs (userId, action, details) VALUES (?, ?, ?)')
    .run((req.session as any).userId, action, details);
  res.status(201).json({ message: 'Log guardado' });
});

export default router;
