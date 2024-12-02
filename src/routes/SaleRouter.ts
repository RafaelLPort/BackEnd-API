import express from 'express';
import { SaleController } from '../controller/SaleController';

export const saleRouter = express.Router();

// Instancia o controlador
const saleController = new SaleController();

saleRouter.post('/sale', saleController.createReceipt);
saleRouter.get('/sale/:ReceiptId', saleController.getReceiptById);