import express from 'express';
import { UserController } from '../controller/UserController';

export const userRouter = express.Router();

// Instancia o controlador
const userController = new UserController();

//==============================================================================================================================

// trocar para somente Barra

//==============================================================================================================================


// Define a rota
userRouter.post('/cliente', userController.createCliente);
userRouter.get('/cliente/:id_cliente', userController.getInfoByClienteId);
userRouter.put('/cliente/:id_cliente', userController.addressUpdate);
userRouter.post('/login', userController.login);
// Get all users?