import { Router } from 'express';
import { validate, validateParams } from '../middleware/schemaMiddleware';
import routeIdScheme from '../schemas/routeIdScheme';
import authMiddleware from '../middleware/authMiddleware';
import * as eventController from '../controllers/event-controller';
import newEventScheme from '../schemas/newEventScheme';

const eventRoutes = Router();

eventRoutes.get('/', eventController.findEvents);

eventRoutes.get('/calendar', authMiddleware, eventController.myCalendar);

eventRoutes.get('/:id', validateParams(routeIdScheme), eventController.findEventById);

eventRoutes.use(authMiddleware);

eventRoutes.post('/', validate(newEventScheme), eventController.createEvent);

eventRoutes.post('/signup/:id', validateParams(routeIdScheme), eventController.signUpToEvent);

eventRoutes.delete('/signup/:id', validateParams(routeIdScheme), eventController.signOutOfEvent);

export default eventRoutes;
