import express from 'express';
import { ProductController } from '../controller/ProductController';

export const ProductRouter = express.Router();

// Instancia o controlador
const ProdutoController = new ProductController();

//==============================================================================================================================

// trocar para somente Barra

//==============================================================================================================================

// Define a rota
ProductRouter.post('/produto', ProdutoController.createProduct);
ProductRouter.get('/produto/', ProdutoController.getAllProdutcs);
ProductRouter.get('/produto/:produtoId', ProdutoController.getProdutoById);
ProductRouter.delete('/produto/:produtoId', ProdutoController.deleteProduto);
ProductRouter.patch('/produto/:produtoId', ProdutoController.updateProduto);




