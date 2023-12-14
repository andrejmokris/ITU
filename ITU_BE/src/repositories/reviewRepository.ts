import { z } from 'zod';
import prisma from '../db';
import newReviewScheme from '../schemas/newReviewSchema';

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

export const create = async (userID: number, data: z.infer<typeof newReviewScheme>) => {
  const createdEvent = await prisma.review.create({
    data: { userId: userID, content: data.body.comment, starsGiven: data.body.rating, shopId: data.body.shopId }
  });

  return createdEvent;
};
