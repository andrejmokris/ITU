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

export const findByTags = async (tagNames: string[]) => {
  const data = await prisma.shop.findMany({
    where: {
      AND: tagNames.map((tag) => ({
        ShopTag: {
          some: {
            tag: {
              title: {
                contains: tag,
                mode: 'insensitive'
              }
            }
          }
        }
      }))
    }
  });
  return data;
};

export const findByLocation = async (location: string) => {
  const data = await prisma.shop.findMany({
    where: {
      address: {
        contains: location,
        mode: 'insensitive'
      }
    }
  });

  return data;
};
