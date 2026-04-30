import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  email: string;
};

export interface AuthRequest extends Request {
  user: JwtPayload;
}
