import express from 'express';
import { UserController } from '../controller/UserController';

export const userRouter = express.Router();

// Instancia o controlador
const userController = new UserController();


// Define a rota
userRouter.post('/user', userController.createUser);
userRouter.get('/user/:id_user', userController.getInfoByUserId);
userRouter.put('/user/:id_user', userController.addressUpdate);
userRouter.post('/login', userController.login);
// Get all users?