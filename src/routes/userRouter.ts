import express from 'express';
import { UserController } from '../controller/UserController';

export const userRouter = express.Router();

// Instancia o controlador
const userController = new UserController();

// Define a rota
userRouter.post('/cliente', userController.createCliente);
