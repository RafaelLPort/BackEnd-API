import connection from '../config/connection';
import { Product } from '../types/product';

export class ProductData {
    
    // Método para criar um novo Product
    createProduct = async (Product: Product): Promise<void> => {
        await connection('product').insert(Product);
    };
    
    // Método para buscar todos os Products
    getAllProducts = async (offset: number, limit: number): Promise<Product[]> => {
        const Products = await connection('product')
            .select('*')
            .limit(limit)  // Limitando os resultados
            .offset(offset);  // Definindo o deslocamento para a página correta
    
        return Products;
    };
    
    // Método para buscar um Product por ID
    getProductById = async (id_product: string): Promise<Product | null> => {
        const result = await connection('product').where({ id_product }).first();
        return result || null;
    };

    //mudar os nomes
    
    // Método para atualizar um Product
    updateProduct = async (id_product: string,
        name_product: string,
        price_product: number,
        desc_product: string,
        category_product: string,
        stock_product: number) => {

        const Product = await connection('product').where({ id_product: id_product }).first();


        if (!Product) {
            throw new Error('Product not found.');
        }

        await connection('product')
        .where({ id_product: id_product })
        .update({
            name_product: name_product,
            price_product: price_product,
            desc_product: desc_product,
            category_product: category_product,
            stock_product: stock_product 
        });
    };







    // Método para deletar um Product
    deleteProductById = async (id_product: string): Promise<void> => {
        await connection('product').where({ id_product }).delete();
    };




    //testar para ver se o codigo funciona so com 1 filtro

    // Método para buscar Products com filtros (nome, categoria e Order)
    getProductWithFilter = async (offset: number, limit: number, name_product?: string, category_product?: string, Order?: string ): Promise<Product[]> => {
        let query = connection('product');

        // Filtro por nome
        if (name_product) {
            query = query.where('name_product', 'ilike', `%${name_product}%`);
        }

        // Filtro por categoria
        if (category_product) {
            query = query.where('category_product', 'ilike', `%${category_product}%`);
        }

        // Ordenação
        if (Order) {
            query = query.orderBy('name_product', Order.toLowerCase());
        }

        const Products = await query
        .select('*')  // Seleciona todas as colunas da tabela
        .limit(limit)  // Limitando os resultados
        .offset(offset);  // Definindo o deslocamento

        return Products;
    };
}
