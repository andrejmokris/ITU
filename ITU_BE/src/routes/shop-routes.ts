import { Router } from 'express';
import * as ShopController from '../controllers/shop-controller';
import { upload } from '../config/multer-config';
import authMiddleware from '../middleware/authMiddleware';

const shopRouter = Router();

shopRouter.use(authMiddleware);

// Get all shops
shopRouter.get('/', ShopController.getAllShops);

// Get shop photo by ID
shopRouter.get('/photo/:id', ShopController.getPhoto);

// Get shop by ID
shopRouter.get('/:id', ShopController.getShopById);

// Upload photo for a shop by ID
shopRouter.post('/upload/:id', upload.single('file'), ShopController.uploadPhoto);

export default shopRouter;
