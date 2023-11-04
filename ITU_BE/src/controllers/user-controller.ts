import { NextFunction, Request, Response } from 'express';
import * as userRepository from '../repositories/userRepository';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';
import signUpScheme from '../schemas/signUpScheme';
import { comparePasswords, generateToken, hashPassword } from '../utils/crypto';
import z from 'zod';
import loginScheme from '../schemas/loginScheme';

export const getUsers = async (req: Request, res: Response) => {};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const userData = req as z.infer<typeof signUpScheme>;

  if (await userRepository.findByEmail(userData.body.email)) {
    next(new ConflictError('User already exists'));
    return;
  }

  const hashedPassword = await hashPassword(userData.body.password);

  try {
    const user = await userRepository.create(userData.body.full_name, userData.body.email, hashedPassword);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const logIn = async (req: Request, res: Response, next: NextFunction) => {
  const userData = req as z.infer<typeof loginScheme>;

  const user = await userRepository.findByEmail(userData.body.email);

  if (!user || !(await comparePasswords(userData.body.password, user.password))) {
    next(new UnauthorizedError('Invalid credentials'));
    return;
  }

  res.json({
    token: generateToken(user.id)
  });
};
