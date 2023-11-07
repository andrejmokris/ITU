import { Router } from 'express';
import * as usersController from '../controllers/user-controller';
import { validate } from '../middleware/schemaMiddleware';
import signUpScheme from '../schemas/signUpScheme';
import loginScheme from '../schemas/loginScheme';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/', usersController.getUsers);
router.get('/me', authMiddleware, usersController.getMyProfile);
router.post('/sign-up', validate(signUpScheme), usersController.signUp);
router.post('/log-in', validate(loginScheme), usersController.logIn);

export default router;
