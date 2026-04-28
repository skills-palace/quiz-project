import config from 'config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ErrorHandler from '../services/ErrorHandler';

const auth = (roles: number[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ErrorHandler.unAuthorize('Token not found'));
    }

    // Extract the token
    const accessToken = authHeader.split(' ')[1];

    try {
      const user: any = jwt.verify(
        accessToken,
        config.get<string>('JWT.SECRET')
      );

      if (!roles.includes(user.role)) {
        return next(ErrorHandler.unAuthorize('Unauthorized access'));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(ErrorHandler.unAuthorize('Token invalid or expired'));
    }
  };
};

export default auth;
