import prisma from '../db';

export const userFollowsShop = async (shopID: number, userID: number) => {
  return await prisma.follow.findFirst({
    where: {
      userId: userID,
      shopId: shopID
    }
  });
};

export const create = async (shopID: number, userID: number) => {
  return await prisma.follow.create({
    data: {
      userId: userID,
      shopId: shopID
    }
  });
};

export const remove = async (id: number) => {
  return await prisma.follow.delete({
    where: {
      id: id
    }
  });
};

export const userFollows = async (userID: number) => {
  return await prisma.follow.findMany({
    where: {
      userId: userID
    }
  });
};

export const shopFollows = async (shopID: number) => {
  return await prisma.follow.findMany({
    where: {
      shopId: shopID
    }
  });
};
