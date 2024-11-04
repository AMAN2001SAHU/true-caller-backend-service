import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

const getTokenFromHeaders = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (
    authHeader &&
    (authHeader.startsWith('Token') || authHeader.startsWith('Bearer'))
  ) {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromHeaders(req);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    //@ts-ignore
    // console.log(req.user.user.id);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
