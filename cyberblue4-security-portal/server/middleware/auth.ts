import { Request, Response, NextFunction } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session as any).userId) {
    return res.status(401).json({ message: 'Acceso denegado. Inicie sesión.' });
  }
  next();
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any).role !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores.' });
  }
  next();
};
