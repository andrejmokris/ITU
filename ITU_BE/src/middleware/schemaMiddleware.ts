import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ValidationError } from '../utils/errors'; // Import your custom ValidationError class

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    await schema.parseAsync({
      body: req.body
    });
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    next(new ValidationError('Validation error')); // Pass the error to the error handling middleware
  }
};

export const validateParams = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      params: req.params
    });
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    next(new ValidationError('Validation error')); // Pass the error to the error handling middleware
  }
};
