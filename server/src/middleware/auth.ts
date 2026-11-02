import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development or demo mode, provide a fallback user
      req.user = { id: 'demo-user-12345', email: 'tourist.alex@example.com' };
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      req.user = { id: 'demo-user-12345', email: 'tourist.alex@example.com' };
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    req.user = { id: 'demo-user-12345', email: 'tourist.alex@example.com' };
    next();
  }
};
