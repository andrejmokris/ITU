import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import * as MarketPlaceController from '../controllers/marketPlace-controller';
import { validateParams } from '../middleware/schemaMiddleware';
import routeIdScheme from '../schemas/routeIdScheme';

const marketPlaceRouter = Router();

marketPlaceRouter.get('/photo/:id', validateParams(routeIdScheme), MarketPlaceController.getMarketPhoto);
marketPlaceRouter.get('/', MarketPlaceController.getAllItems);

marketPlaceRouter.use(authMiddleware);

marketPlaceRouter.post('/bookmark/:id', validateParams(routeIdScheme), MarketPlaceController.addBookmark);
marketPlaceRouter.delete('/bookmark/:id', validateParams(routeIdScheme), MarketPlaceController.removeBookmark);

marketPlaceRouter.delete('/:id', validateParams(routeIdScheme), MarketPlaceController.deleteItem);
marketPlaceRouter.post('/:id', validateParams(routeIdScheme), MarketPlaceController.buyItem);

export default marketPlaceRouter;
