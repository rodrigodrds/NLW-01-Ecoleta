import express from 'express';

import PointsController from './controllers/PointsControllers';
import ItemController from './controllers/ItemsControllers';

const routes = express.Router();
const pointsController = new PointsController();
const itemController = new ItemController();

routes.get('/items', itemController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', pointsController.create);

export default routes;
