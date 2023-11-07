import { NextFunction, Request, Response } from 'express';
import * as reviewRepository from '../repositories/reviewRepository';

export const getReviewsForShop = async (req: Request, res: Response) => {
  const data = await reviewRepository.shopReviews(Number(req.params.id));
  res.json(data);
};
