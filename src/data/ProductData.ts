import connection from '../config/connection';
import { Produto } from '../types/product';

export class ProductData {
    
    // Método para criar um novo produto
    createProduct = async (produto: Produto): Promise<void> => {
        await connection('produto').insert(produto);
    };
    
    // Método para buscar todos os produtos
    getAllProdutos = async (offset: number, limit: number): Promise<Produto[]> => {
        const produtos = await connection('produto')
            .select('*')
            .limit(limit)  // Limitando os resultados
            .offset(offset);  // Definindo o deslocamento para a página correta
    
        return produtos;
    };
    
    // Método para buscar um produto por ID
    getProdutoById = async (id_produto: string): Promise<Produto | null> => {
        const result = await connection('produto').where({ id_produto }).first();
        return result || null;
    };

    //mudar os nomes
    
    // Método para atualizar um produto
    updateProduto = async (id_produto: string,
        nome_produto: string,
        preco_produto: number,
        desc_produto: string,
        categoria_produto: string,
        estoque_produto: number) => {

        const produto = await connection('produto').where({ id_produto: id_produto }).first();


        if (!produto) {
            throw new Error('Produto não encontrado.');
        }

        await connection('produto')
        .where({ id_produto: id_produto })
        .update({
            nome_produto: nome_produto,
            preco_produto: preco_produto,
            desc_produto: desc_produto,
            categoria_produto: categoria_produto,
            estoque_produto: estoque_produto 
        });
    };







    // Método para deletar um produto
    deleteProdutoById = async (id_produto: string): Promise<void> => {
        await connection('produto').where({ id_produto }).delete();
    };




    //testar para ver se o codigo funciona so com 1 filtro

    // Método para buscar produtos com filtros (nome, categoria e ordem)
    getProdutoWithFilter = async (offset: number, limit: number, nome_produto?: string, categoria_produto?: string, ordem?: string ): Promise<Produto[]> => {
        let query = connection('produto');

        // Filtro por nome
        if (nome_produto) {
            query = query.where('nome_produto', 'ilike', `%${nome_produto}%`);
        }

        // Filtro por categoria
        if (categoria_produto) {
            query = query.where('categoria_produto', 'ilike', `%${categoria_produto}%`);
        }

        // Ordenação
        if (ordem) {
            query = query.orderBy('nome_produto', ordem.toLowerCase());
        }

        const produtos = await query
        .select('*')  // Seleciona todas as colunas da tabela
        .limit(limit)  // Limitando os resultados
        .offset(offset);  // Definindo o deslocamento

        return produtos;
    };
}
