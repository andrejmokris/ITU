import { config } from '../config/default';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(config.auth.saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePasswords = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const generateToken = (userID: number) => {
  const token = jwt.sign(String(userID), config.auth.secret);
  return token;
};

export const verifyToken = (token: string): any => {
  const payload = jwt.verify(token, config.auth.secret);
  return payload;
};

export const createPasswordResetToken = () => {
  const token = randomBytes(20).toString('hex');
  return token;
};
