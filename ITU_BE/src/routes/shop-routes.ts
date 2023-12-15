import { Router } from 'express';
import * as ShopController from '../controllers/shop-controller';
import { upload } from '../config/multer-config';

const shopRouter = Router();

// Get all shops
shopRouter.get('/', ShopController.getAllShops);

// Get shop photo by ID
shopRouter.get('/photo/:id', ShopController.getPhoto);

// Get shop by ID
shopRouter.get('/:id', ShopController.getShopById);

// Get filtered shops
shopRouter.get('/filter', ShopController.filterShops);

// Upload photo for a shop by ID
shopRouter.post('/upload/:id', upload.single('file'), ShopController.uploadPhoto);

export default shopRouter;
