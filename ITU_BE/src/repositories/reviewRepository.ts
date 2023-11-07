import prisma from '../db';

export const shopReviews = async (shopID: number) => {
  return await prisma.review.findMany({
    where: {
      shopId: shopID
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });
};
