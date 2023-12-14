import prisma from '../db';

export const findById = async (id: number) => {
  const data = await prisma.tag.findFirst({
    where: {
      id: id
    }
  });

  return data;
};

export const findAll = async () => {
  const data = await prisma.tag.findMany();
  return data;
};
