import prisma from '../db';
import { ConflictError } from '../utils/errors';

export const findById = async (id: number) => {
  const data = await prisma.user.findFirst({
    where: {
      id: id
    }
  });
  return data;
};

export const findByEmail = async (email: string) => {
  const data = await prisma.user.findFirst({
    where: {
      email: email
    }
  });
  return data;
};

export const create = async (name: string, email: string, password: string) => {
  try {
    const data = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: password
      }
    });
    return data;
  } catch (error) {
    throw new ConflictError('User with the email already exists');
  }
};
