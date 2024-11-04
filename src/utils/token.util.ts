import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const generateToken = (id: number): string =>
  jwt.sign({ user: { id } }, JWT_SECRET || 'mysupersecret', {
    expiresIn: '60d',
  });

export default generateToken;
