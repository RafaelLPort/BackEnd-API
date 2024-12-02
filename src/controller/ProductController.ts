import { Request, Response } from 'express';
import { ProductBusiness } from '../business/ProductBusiness';
import { Product } from '../types/product';

export class ProductController {
    ProductBusiness = new ProductBusiness();

    // Criar um novo Product
    createProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name_product, desc_product, price_product, category_product, stock_product } = req.body;

            // Chama a camada de negócios para criar o Product
            const Product = await this.ProductBusiness.createProduct(
                name_product, 
                desc_product, 
                price_product, 
                category_product, 
                stock_product);

            res.status(201).json({ message: "Product added successfully.", Product });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || "Error adding product!";
            res.status(400).json({ error: message });
        }
    };

    // Buscar todos os Products
    getAllProdutcs = async (req: Request, res: Response): Promise<void> => {
        try {
            let { page } = req.query; // Usando valor 1 como padrão para a página
            // Convertendo "page" para número
        const numPage = parseInt(page as string);
            
            if (isNaN(numPage) || numPage <= 0) {
                res.status(400).json({ message: "The 'page' parameter must be a valid number greater than zero." });
            }

            const itemsPerPage = 10; // Defina o número de itens por página
    
            const Products = await this.ProductBusiness.getAllProducts(numPage, itemsPerPage);
    
            if (Products.length === 0) {
                res.status(404).json({ message: "No product found." });
                return;
            }

            res.status(200).json({ message: "Products found.", Products });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || "Error fetching the products!";
            res.status(400).json({ error: message });
        }
    };

    // Buscar um Product pelo ID
    getProductById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { productId } = req.params;

            const Product = await this.ProductBusiness.getProductById(productId);

            if (!Product) {
                res.status(404).json({ message: 'Product not found.' });
                return;
            }

            res.status(200).json({ message: 'Product found.', Product });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Error fetching product!';
            res.status(400).json({ error: message });
        }
    };

    // Atualizar um Product
    updateProduct = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const { name_product, price_product, stock_product, desc_product, category_product } = req.body;

            // Chama a camada de negócios para atualizar o Product
            const Product = await this.ProductBusiness.updateProduct(productId,name_product,price_product,desc_product,category_product,stock_product);


            res.status(200).json({ message: 'Product updated successfully.', Product });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Error updating product!';
            res.status(400).json({ error: message });
        }
    };

    // Buscar um Product por filtro
    getProductWithFilter = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name_product , category_product, Order, page } = req.query;

            const OrderProduct = (Order as string);
            const nomeProduct = (name_product as string);
            const categoriaProduct = (category_product as string);
            

            const numPage = parseInt(page as string);

            if (isNaN(numPage) || numPage <= 0) {
                res.status(400).json({ message: "The 'page' parameter must be a valid number greater than zero." });
            }


            const itemsPerPage = 10;

            const Product = await this.ProductBusiness.getProductWithFilter(nomeProduct, categoriaProduct, OrderProduct, numPage, itemsPerPage);

            if (!Product) {
                res.status(404).json({ message: 'Product not found.' });
                return;
            }

            res.status(200).json({ message: 'Product found.', Product });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Error fetching product!';
            res.status(400).json({ error: message });
        }
    };

    // Deletar um Product pelo ID
    deleteProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { productId } = req.params;

            await this.ProductBusiness.deleteProductById(productId);

            res.status(200).json({ message: 'Product deleted successfully.' });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Error deleting product!';
            res.status(400).json({ error: message });
        }
    };
}

