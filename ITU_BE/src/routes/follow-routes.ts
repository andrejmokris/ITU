import { Router } from 'express';
import * as followController from '../controllers/follow-controller';
import authMiddleware from '../middleware/authMiddleware';

const follow_router = Router();

follow_router.get('/:id', authMiddleware, followController.isUserFollowingShop);
follow_router.post('/:id', authMiddleware, followController.newShopFollow);
follow_router.delete('/:id', authMiddleware, followController.removeFollow);

export default follow_router;
