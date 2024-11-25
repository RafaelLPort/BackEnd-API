import { Request, Response } from 'express';
import { ProdutoBusiness } from '../business/ProductBusiness';
import { Produto } from '../types/product';

export class ProductController {
    produtoBusiness = new ProdutoBusiness();

    // Criar um novo produto
    createProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome_produto, desc_produto, preco_produto, categoria_produto, estoque_produto } = req.body;

            // Chama a camada de negócios para criar o produto
            const Produto = await this.produtoBusiness.createProduct(
                nome_produto, 
                desc_produto, 
                preco_produto, 
                categoria_produto, 
                estoque_produto);

            res.status(201).json({ message: 'Produto adicionado com sucesso', Produto });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao adicionar produto!';
            res.status(400).json({ error: message });
        }
    };

    // Buscar todos os produtos
    getAllProdutcs = async (req: Request, res: Response): Promise<void> => {
        try {
            const produtos = await this.produtoBusiness.getAllProdutos();

            if (produtos.length === 0) {
                res.status(404).json({ message: 'Nenhum produto encontrado' });
                return;
            }

            res.status(200).json({ message: 'Produtos encontrados', produtos });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao buscar os produtos!';
            res.status(400).json({ error: message });
        }
    };

    // Buscar um produto pelo ID
    getProdutoById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { produtoId } = req.params;

            const produto = await this.produtoBusiness.getProdutoById(produtoId);

            if (!produto) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            res.status(200).json({ message: 'Produto encontrado', produto });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao buscar produto!';
            res.status(400).json({ error: message });
        }
    };

    // Atualizar um produto
    updateProduto = async (req: Request, res: Response) => {
        try {
            const { produtoId } = req.params;
            const { nome_produto, preco_produto, estoque_produto, desc_produto, categoria_produto } = req.body;

            // Chama a camada de negócios para atualizar o produto
            const produto = await this.produtoBusiness.updateProduto(produtoId, nome_produto, preco_produto, desc_produto,  categoria_produto, estoque_produto);

            res.status(200).json({ message: 'Produto atualizado com sucesso', produto });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao atualizar produto!';
            res.status(400).json({ error: message });
        }
    };

    // Buscar um produto por filtro
    getProductWithFilter = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome_produto, categoria_produto, ordem } = req.body;

            const produto = await this.produtoBusiness.getProdutoWithFilter(nome_produto, categoria_produto, ordem);

            if (!produto) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            res.status(200).json({ message: 'Produto encontrado', produto });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao buscar produto!';
            res.status(400).json({ error: message });
        }
    };

    // Deletar um produto pelo ID
    deleteProduto = async (req: Request, res: Response): Promise<void> => {
        try {
            const { produtoId } = req.params;

            await this.produtoBusiness.deleteProdutoById(produtoId);

            res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao deletar produto!';
            res.status(400).json({ error: message });
        }
    };
}

