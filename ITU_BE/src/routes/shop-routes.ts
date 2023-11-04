import { Router } from 'express';
import { validate } from '../middleware/schemaMiddleware';

const shopRouter = Router();

shopRouter.get('/');
shopRouter.post('/signup');
shopRouter.post('/');

export default shopRouter;
