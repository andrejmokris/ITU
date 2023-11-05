import prisma from '../db';

export const findAll = async () => {
  const data = await prisma.shop.findMany();
  return data;
};

export const findById = async (id: number) => {
  const data = await prisma.shop.findFirst({
    where: {
      id: id
    }
  });
  return data;
};
