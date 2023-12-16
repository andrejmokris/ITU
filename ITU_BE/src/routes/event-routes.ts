import { Router } from 'express';
import { validate, validateParams } from '../middleware/schemaMiddleware';
import routeIdScheme from '../schemas/routeIdScheme';
import authMiddleware from '../middleware/authMiddleware';
import * as eventController from '../controllers/event-controller';
import newEventScheme from '../schemas/newEventScheme';

const eventRoutes = Router();

eventRoutes.use(authMiddleware);

eventRoutes.get('/', eventController.findEvents);

eventRoutes.get('/calendar', eventController.myCalendar);

eventRoutes.get('/:id', validateParams(routeIdScheme), eventController.findEventById);

eventRoutes.post('/', validate(newEventScheme), eventController.createEvent);

eventRoutes.get('/me/:id', validateParams(routeIdScheme), eventController.doIAttent);

eventRoutes.post('/signup/:id', validateParams(routeIdScheme), eventController.signUpToEvent);

eventRoutes.delete('/signup/:id', validateParams(routeIdScheme), eventController.signOutOfEvent);

export default eventRoutes;
