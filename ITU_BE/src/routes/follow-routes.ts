import { Router } from 'express';
import * as followController from '../controllers/follow-controller';
import authMiddleware from '../middleware/authMiddleware';

const follow_router = Router();

follow_router.use(authMiddleware);

follow_router.get('/:id', followController.isUserFollowingShop);
follow_router.post('/:id', followController.newShopFollow);
follow_router.delete('/:id', followController.removeFollow);

export default follow_router;
