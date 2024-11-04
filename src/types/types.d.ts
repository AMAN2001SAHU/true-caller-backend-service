import { JwtPayload } from 'jsonwebtoken';

declare;
namespace Express {
  export interface Request {
    user?: any;
  }
  export interface Response {
    user: any;
  }
}
