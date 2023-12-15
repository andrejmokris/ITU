import { NextFunction, Request, Response } from 'express';
import * as reviewRepository from '../repositories/reviewRepository';
import newReviewScheme from '../schemas/newReviewSchema';
import { NotFoundError } from '../utils/errors';
import { findById } from '../repositories/shopRepository';
import { z } from 'zod';
import prisma from '../db';

export const getReviewsForShop = async (req: Request, res: Response) => {
  const data = await reviewRepository.shopReviews(Number(req.params.id));
  res.json(data);
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userID = req.user;
  const data = req as z.infer<typeof newReviewScheme>;
  const shop = findById(data.body.shopId);

  if (!shop) {
    next(new NotFoundError('Shop not found'));
    return;
  }

  const createdReview = await reviewRepository.create(userID, data);

  res.json(createdReview);
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  const reviewId = Number(req.params.id);
  const deletedReview = await prisma.review.delete({
    where: {
      id: reviewId
    }
  });

  res.json(deletedReview);
};
