import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import * as MarketPlaceController from '../controllers/marketPlace-controller';
import { validateParams } from '../middleware/schemaMiddleware';
import routeIdScheme from '../schemas/routeIdScheme';
import { upload } from '../config/multer-config';

const marketPlaceRouter = Router();

marketPlaceRouter.get('/photo/:id', validateParams(routeIdScheme), MarketPlaceController.getMarketPhoto);

marketPlaceRouter.use(authMiddleware);

marketPlaceRouter.get('/myorders', MarketPlaceController.getMyOrders);

marketPlaceRouter.get('/', MarketPlaceController.getAllItems);

marketPlaceRouter.post('/', upload.single('image'), MarketPlaceController.createItem);

marketPlaceRouter.post('/bookmark/:id', validateParams(routeIdScheme), MarketPlaceController.addBookmark);
marketPlaceRouter.delete('/bookmark/:id', validateParams(routeIdScheme), MarketPlaceController.removeBookmark);

marketPlaceRouter.delete('/:id', validateParams(routeIdScheme), MarketPlaceController.deleteItem);
marketPlaceRouter.post('/:id', validateParams(routeIdScheme), MarketPlaceController.buyItem);

export default marketPlaceRouter;
