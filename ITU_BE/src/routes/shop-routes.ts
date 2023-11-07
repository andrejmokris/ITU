import { Router } from 'express';
import * as ShopController from '../controllers/shop-controller';

const shopRouter = Router();

shopRouter.get('/', ShopController.getAllShops);
shopRouter.get('/:id', ShopController.getShopById);
shopRouter.get('/filter', ShopController.filterShops);

export default shopRouter;
