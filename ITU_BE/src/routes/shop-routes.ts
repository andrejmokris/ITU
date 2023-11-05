import { Router } from 'express';
import * as ShopController from '../controllers/shop-controller';

const shopRouter = Router();

shopRouter.get('/', ShopController.getAllShops);
shopRouter.get('/filter', ShopController.filterShops);
shopRouter.post('/:id', ShopController.getShopById);

export default shopRouter;
