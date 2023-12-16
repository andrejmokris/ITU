import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import * as MarketPlaceController from '../controllers/marketPlace-controller';

const marketPlaceRouter = Router();

marketPlaceRouter.get('/photo/:id', MarketPlaceController.getMarketPhoto);
marketPlaceRouter.get('/', MarketPlaceController.getAllItems);

marketPlaceRouter.use(authMiddleware);

marketPlaceRouter.delete('/:id', MarketPlaceController.deleteItem);
marketPlaceRouter.post('/:id', MarketPlaceController.buyItem);

export default marketPlaceRouter;
