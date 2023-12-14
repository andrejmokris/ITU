import { Router } from 'express';
import * as tagController from '../controllers/tag-controller';

const tagRoutes = Router();

tagRoutes.get('/', tagController.getTags);
tagRoutes.get('/:id', tagController.getTagById);

export default tagRoutes;
