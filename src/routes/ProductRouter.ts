import express from 'express';
import { ProductController } from '../controller/ProductController';

export const ProductRouter = express.Router();

// Instancia o controlador
const ProdutoController = new ProductController();

// Define a rota
ProductRouter.post('/cliente', ProdutoController.createProduct);
ProductRouter.get('/cliente/:id', ProdutoController.getAllProdutcs);
ProductRouter.get('/cliente/:id', ProdutoController.getProdutoById);
ProductRouter.get('/cliente/:id', ProdutoController.deleteProduto);




