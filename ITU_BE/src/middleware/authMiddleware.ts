import { UnauthorizedError, ValidationError } from '../utils/errors';
import { verifyToken } from '../utils/crypto';
import { NextFunction, Request, Response } from 'express';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    res.status(400);
    next(new ValidationError('Token not found'));
    return;
  }

  try {
    const id = verifyToken(token);
    // @ts-expect-error
    req.user = Number(id);
    next();
  } catch (error) {
    next(new UnauthorizedError());
  }
};

export default authMiddleware;
