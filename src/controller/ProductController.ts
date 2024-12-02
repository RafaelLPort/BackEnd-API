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
            let { page } = req.query; // Usando valor 1 como padrão para a página
            // Convertendo "page" para número
        const numPage = parseInt(page as string);

            console.log("- ", req.params.page);
            console.log("- ", numPage);
            
            if (isNaN(numPage) || numPage <= 0) {
                res.status(400).json({ message: "O parâmetro 'page' deve ser um número válido e maior que zero." });
            }

            const itemsPerPage = 10; // Defina o número de itens por página
    
            const produtos = await this.produtoBusiness.getAllProdutos(numPage, itemsPerPage);
    
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

            console.log("ProdutoId recebido:", req.params.produtoId);

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
            
            console.log("- ", req.params.produtoId);
            console.log("- ", req.body.nome_produto);
            console.log("- ", req.body.preco_produto);
            console.log("- ", req.body.desc_produto);
            console.log("- ", req.body.estoque_produto);

            // Chama a camada de negócios para atualizar o produto
            const produto = await this.produtoBusiness.updateProduto(produtoId,nome_produto,preco_produto,desc_produto,categoria_produto,estoque_produto);


            res.status(200).json({ message: 'Produto atualizado com sucesso', produto });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao atualizar produto!';
            res.status(400).json({ error: message });
        }
    };

    // Buscar um produto por filtro
    getProductWithFilter = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome_produto , categoria_produto, ordem, page } = req.query;

            const ordemProduto = (ordem as string);
            const nomeProduto = (nome_produto as string);
            const categoriaProduto = (categoria_produto as string);
            
            // const ordemProduto = (req.query.ordem as string);

            // console.log("nome - ", req.query.nome_produto);
            // console.log("categoria - ", req.query.categoria_produto);
            // console.log("ordem - ", req.query.ordem);

            // console.log("----------------------------------------- V variaveis");

            // console.log("nome - ", nomeProduto);
            // console.log("categoria - ", categoriaProduto);
            // console.log("ordem - ", ordemProduto);

            const numPage = parseInt(page as string);

            // console.log("- ", req.query.page);
            // console.log("- ", numPage);
            
            if (isNaN(numPage) || numPage <= 0) {
                res.status(400).json({ message: "O parâmetro 'page' deve ser um número válido e maior que zero." });
            }


            const itemsPerPage = 10;

            const produto = await this.produtoBusiness.getProdutoWithFilter(nomeProduto, categoriaProduto, ordemProduto, numPage, itemsPerPage);

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

