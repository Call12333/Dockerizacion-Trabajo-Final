import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db';
import { validationResult } from 'express-validator';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, displayName } = req.body;

  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
    const role = userCount.count === 0 ? 'admin' : 'user';

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, password, displayName, role) VALUES (?, ?, ?, ?)'
    ).run(email, hashedPassword, displayName, role);

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.lastInsertRowid });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Guardar en sesión
    (req.session as any).userId = user.id;
    (req.session as any).userEmail = user.email;
    (req.session as any).role = user.role;

    // Log de seguridad
    db.prepare('INSERT INTO logs (userId, action, details) VALUES (?, ?, ?)')
      .run(user.id, 'Login', 'Inicio de sesión exitoso mediante backend propio.');

    res.json({ 
      message: 'Login exitoso', 
      user: { 
        id: user.id, 
        email: user.email, 
        displayName: user.displayName, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'No se pudo cerrar la sesión' });
    }
    res.clearCookie('cyberblue.sid', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });
    res.json({ message: 'Sesión cerrada' });
  });
};

export const getMe = (req: Request, res: Response) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const user: any = db.prepare('SELECT id, email, displayName, role FROM users WHERE id = ?').get(userId);
  res.json(user);
};
