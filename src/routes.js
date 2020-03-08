import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import AvailableDeliveryController from './app/controllers/AvailableDeliveryController';
import CompleteDeliveryController from './app/controllers/CompleteDeliveryController';
import WithdrawDeliveryController from './app/controllers/WithdrawDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ProblemDeliveryController from './app/controllers/ProblemDeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Returns all available deliveries
routes.get(
  '/deliveryman/:deliverymanId/deliveries/available',
  AvailableDeliveryController.index
);

// Returns all completed deliveries
routes.get(
  '/deliveryman/:deliverymanId/deliveries/completed',
  CompleteDeliveryController.index
);

routes.put(
  '/delivery/withdrawal/:deliveryId',
  WithdrawDeliveryController.update
);

routes.put('/delivery/complete/:deliveryId', CompleteDeliveryController.update);

routes.post('/delivery/:deliveryId/problems', DeliveryProblemController.store);

// Everything that comes after this middleware, will execute the authMiddleware
routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// Returns all problems for the selected delivery
routes.get('/delivery/:deliveryId/problems', DeliveryProblemController.index);

// Returns all deliveries with problems
routes.get('/deliveries/problems', ProblemDeliveryController.index);

// Cancel the delivery based on the problem
routes.delete(
  '/problem/:deliveryProblemId/cancel-delivery',
  ProblemDeliveryController.delete
);

export default routes;
