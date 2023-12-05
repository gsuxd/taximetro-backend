import { Router } from 'express';
import { createUserTest, createVehicleTest, GetNearDriversTest, SendLocationTest, Test } from '../controllers/test.controllers';

const testRouter = Router();

testRouter.get('/get', Test);
testRouter.post('/create-user', createUserTest);
testRouter.post('/create-vehicle', createVehicleTest);
testRouter.post('/send-location', SendLocationTest);
testRouter.get('/get-drivers-near', GetNearDriversTest);

export default testRouter;