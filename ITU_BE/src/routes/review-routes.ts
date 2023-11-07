import { Router } from 'express';
import * as reviewController from '../controllers/review-controller';

const review_router = Router();

review_router.get('/:id', reviewController.getReviewsForShop);

export default review_router;
