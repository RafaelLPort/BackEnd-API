import express from 'express';
import { ProductController } from '../controller/ProductController';

export const ProductRouter = express.Router();

// Instancia o controlador
const productController = new ProductController();

// Define a rota
ProductRouter.post('/product', productController.createProduct);
ProductRouter.get('/product/', productController.getAllProdutcs);
ProductRouter.get('/productwithfilter/', productController.getProductWithFilter);
ProductRouter.get('/product/:productId', productController.getProductById);
ProductRouter.delete('/product/:productId', productController.deleteProduct);
ProductRouter.patch('/product/:productId', productController.updateProduct);




