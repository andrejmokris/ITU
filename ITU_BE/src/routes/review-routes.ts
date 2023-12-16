import { Router } from 'express';
import * as reviewController from '../controllers/review-controller';
import { validate } from '../middleware/schemaMiddleware';
import newReviewScheme from '../schemas/newReviewSchema';
import authMiddleware from '../middleware/authMiddleware';

const review_router = Router();

review_router.use(authMiddleware);

review_router.get('/:id', reviewController.getReviewsForShop);

review_router.delete('/:id', reviewController.deleteReview);

review_router.post('/', validate(newReviewScheme), reviewController.createReview);

export default review_router;
