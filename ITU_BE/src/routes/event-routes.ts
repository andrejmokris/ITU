import { Router } from 'express';
import { validate, validateParams } from '../middleware/schemaMiddleware';
import routeIdScheme from '../schemas/routeIdScheme';
import authMiddleware from '../middleware/authMiddleware';
import * as eventController from '../controllers/event-controller';
import newEventScheme from '../schemas/newEventScheme';
import newCommentScheme from '../schemas/newCommentScheme';

const eventRoutes = Router();

eventRoutes.use(authMiddleware);

eventRoutes.get('/', eventController.findEvents);

eventRoutes.get('/calendar', eventController.myCalendar);

eventRoutes.get('/:id', validateParams(routeIdScheme), eventController.findEventById);

eventRoutes.put('/:id', [validateParams(routeIdScheme), validate(newEventScheme)], eventController.editEvent);
eventRoutes.delete('/:id', validateParams(routeIdScheme), eventController.deleteEvent);

eventRoutes.post('/', validate(newEventScheme), eventController.createEvent);

eventRoutes.get('/me/:id', validateParams(routeIdScheme), eventController.doIAttent);

eventRoutes.post('/signup/:id', validateParams(routeIdScheme), eventController.signUpToEvent);

eventRoutes.delete('/signup/:id', validateParams(routeIdScheme), eventController.signOutOfEvent);

eventRoutes.get('/comments/:id', validateParams(routeIdScheme), eventController.getComments);

eventRoutes.post(
  '/comments/:id',
  [validateParams(routeIdScheme), validate(newCommentScheme)],
  eventController.createComment
);

eventRoutes.delete('/comments/:id', validateParams(routeIdScheme), eventController.deleteComment);

eventRoutes.post('/like/:id', validateParams(routeIdScheme), eventController.likeComment);

export default eventRoutes;
