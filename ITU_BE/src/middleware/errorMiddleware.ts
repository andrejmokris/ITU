import { NextFunction, Response, Request } from 'express';
import { AppError, ValidationError } from '../utils/errors';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.status : 500;

  res.status(statusCode).json({
    type: err.type,
    message: err.message,
    stack: 'dev',
    errors: err instanceof ValidationError ? err.errors : undefined
  });
};

export default errorMiddleware;
