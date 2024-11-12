import express, { Request, Response } from 'express';
import cors from 'cors';
import { v7 as uuidv7 } from 'uuid';
import connection from './config/connection';

const app = express();
app.use(cors());
app.use(express.json());



// CLIENTE

// POST - Cria novo cliente
app.post("/cliente", async(req: Request, res: Response) => {
    try {
        const { nome_cliente, senha_cliente, email_cliente} = req.body;

        //VERIFICA SE OS CAMPOS FORAM PREENCHIDOS
        if (!nome_cliente || !senha_cliente || !email_cliente) {
            res.status(409)
            throw new Error('Preencha todos os campos.');
        }

        //VERIFICAÇÃO SE CLIENTE JÁ EXISTE
        const existingCliente = await connection('cliente').where({ email_cliente });
        if (existingCliente) {
            res.status(401)
            throw new Error('Cliente já existe.');
        }

        //CRIAÇÃO DO CLIENTE INSERÇÃO NO BD
        const id_cliente = uuidv7();
        await connection('cliente').insert({
            id_cliente,
            nome_cliente,
            senha_cliente,
            email_cliente
        });

        res.status(201).json({ message: 'Cliente criado com sucesso!', cliente: { id_cliente, nome_cliente, email_cliente } });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao criar cliente!'
        res.json(message);
    }
});


// GET - Busca as informações de um cliente
app.get('/cliente/infoCliente/:id_cliente', async (req: Request, res: Response) => {
    try {
        const { id_cliente } = req.params;

        //VERIFICAÇÃO DO ID FORNECIDO
        if (!id_cliente) {
            res.status(409)
            throw new Error('ID do cliente é obrigatório.');
        }

       //BUSCA NO BD
        const cliente = await connection('cliente').where({ id_cliente });

        //VERIFICA SE A ID EXISTE
        if (!cliente) {
            res.status(404)
            throw new Error('Cliente não encontrado.');
        }

        // RETORNA AS INFOS PARA A TELA
        res.status(200).json({ message: 'Informações do cliente', cliente });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao buscar informações do cliente!'
        res.json(message);
    }
});



// PRODUTO

// POST - Adiciona novo produto
app.post('/produto', async (req: Request, res: Response) => {
    try {
        const { nome_produto, desc_produto, preco_produto, categoria_produto, estoque_produto } = req.body;

        //VERIFICA SE TODOS OS CAMPOS FORAM PREENCHIDOS
        if (!nome_produto || !desc_produto || !preco_produto || !categoria_produto || !estoque_produto) {
            res.status(409)
            throw new Error('Preencha todos os campos.');
        }

        //VERIFICAÇÃO SE É NUMERO NOS CAMPOS DE PREÇO E ESTOQUE
        if (typeof preco_produto !== 'number' || typeof estoque_produto !== 'number') {
            res.status(400)
            throw new Error('preco_produto e estoque_produto devem ser números.');
        }

        //CRIAÇÃO DO PRODUTO
        const id_produto = uuidv7();
        await connection('produto').insert({
            id_produto,
            nome_produto,
            desc_produto,
            preco_produto,
            categoria_produto,
            estoque_produto
        });

        res.status(201).json({ message: 'Produto adicionado com sucesso', produto: { id_produto, nome_produto, desc_produto, preco_produto, categoria_produto, estoque_produto } });

    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao adicionar novo produto!'
        res.json(message);
    }
});


// GET - Busca todos os produtos
app.get('/produtos', async (req: Request, res: Response) => {
    try {
        //BUSCA DE TODOS OS PRODUTOS NO BD
        const produtos = await connection('produto').select('*');

        //CABEÇALHO DA MENSAGEM DE RETORNO DOS PRODUTOS
        res.status(200).json({ message: 'Todos os produtos', produtos });
        
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao buscar os produtos!'
        res.json(message);
    }
});


// GET - Busca produto por ID
app.get('/produtos/:produtoId', async (req: Request, res: Response) => {
    try {
        const { produtoId } = req.params;

        //CONSULTA NO BD
        const produto = await connection('produto').where({ id_produto: produtoId });

        // VERIFICAÇÃO SE O PRODUTO FOI ACHADO
        if (!produto) {
            res.status(404)
            throw new Error('Produto não encontrado.');
        }

        //CABEÇALHO DO RETORNO E OS PRODUTOS
        res.status(200).json({ message: 'Produto encontrado', produto });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao buscar ID do produto!'
        res.json(message);
    }    
});


// QUANDO NAO TEM FILTRO ELE BUSCA TODOS OS PRODUTOS E QUANDO TEM FILTRO ELE BUSCA O PRODUTO ESPECIFICO - ADICIONAR VERIFICAÇÃO SE CAMPOS FORAM PREENCHIDOS?

// GET - Busca produtos por nome e/ou categoria e ordenação
app.get('/produtoscomfiltro', async (req: Request, res: Response) => {
    try {
        const { nome_produto, categoria_produto, ordem } = req.query;

        // Inicializa a consulta no banco de dados
        let query = connection('produto'); // Removido o 'await' daqui

        // FILTRAGEM POR NOME
        if (nome_produto) {
            query = query.where('nome_produto', 'ilike', `%${nome_produto}%`);
        }

        // FILTRAGEM POR CATEGORIA
        if (categoria_produto) {
            query = query.where('categoria_produto', 'ilike', `%${categoria_produto}%`);
        }

        // FILTRAGEM ASC OU DESC
        if (ordem) {
            // VALIDAÇÃO 'ASC' OU 'DESC'
            const direcaoValida = ['asc', 'desc'].includes((ordem as string).toLowerCase()) ? (ordem as string).toLowerCase() : 'asc';

            // APLICA A ORDENAÇÃO
            query = query.orderBy('nome_produto', direcaoValida);
        }

        // Executa a consulta com o await
        const produtos = await query;

        if (produtos.length === 0) {
            res.status(404).json({ message: 'Nenhum produto encontrado com os filtros especificados.' });
        }


        // RETORNO DOS RESULTADOS FILTRADOS
        res.status(200).json({ message: 'Produtos encontrados', produtos });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao buscar produtos por nome e/ou categoria e ordenação!';
        res.status(500).json({ message });
    }
});




// DELETE - Deleta produto por ID
app.delete("/produtos/:produtoId", async (req: Request, res: Response) => {
    try {
        const { produtoId } = req.params;

        // Verifica se o produto existe
        const produto = await connection('produto').where({ id_produto: produtoId });
        if (!produto) {
            res.status(404)
            throw new Error('Produto não encontrado.');
        }

        // Deleta o produto do banco de dados
        await connection('produto').where({ id_produto: produtoId }).delete();

        res.status(200).json({ message: 'Produto deletado com sucesso', produtoId });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao deletar o produto por ID!'
        res.json(message);
    }
});


// PATCH - Atualiza campos específicos de um produto
app.patch('/produtos/:produtoId', async (req: Request, res: Response) => {
    try {
        const { produtoId } = req.params;
        const { nome, preco, estoque } = req.body;

        //VERIFICAÇÃO SE PREENCHEU O ID DO PRODUTO
        if (!produtoId) {
            res.status(409)
            throw new Error('Preencha o ID do produto.');
        }

        //VERIFICAÇÃO SE O PRODUTO EXISTE
        const produto = await connection('produto').where({ id_produto: produtoId }).first();

        if (!produto) {
            res.status(404)
            throw new Error('Produto não encontrado.');
        }

        //ATUALIZAÇÃO DO PRODUTO
        await connection('produto')
            .where({ id_produto: produtoId })
            .update({
                nome_produto: nome ?? produto.nome_produto,
                preco_produto: preco ?? produto.preco_produto,
                estoque_produto: estoque ?? produto.estoque_produto,
            });

        //BUSCA DE PRODUTO COM A ATUALIZAÇÃO
        const produtoAtualizado = await connection('produto').where({ id_produto: produtoId }).first();

        res.status(200).json({ message: 'Produto atualizado com sucesso', produto: produtoAtualizado });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao atualizar campos específicos de um produto!'
        res.json(message);
    }
});



// VENDA

// GET - Retorna detalhes da venda
app.get('/vendas/:vendaId/revisao', (req: Request, res: Response) => {
    try {
        const { vendaId } = req.params;

        const venda = {}; // Simulação de busca da venda

        if (!venda) {
            res.status(404)
            throw new Error('Venda não encontrada.');
        }

        res.status(200).json({ message: 'Revisão da venda', detalhes: venda });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao retornar detalhes da venda!'
        res.json(message);
    }
});


// PUT - Atualiza endereço de entrega
app.put('/vendas/:vendaId/endereco', (req: Request, res: Response) => {
    try {
        const { vendaId } = req.params;
        const { endereco } = req.body;

        const venda = {}; // Simulação de busca da venda

        if (!venda) {
            res.status(404)
            throw new Error('Venda não encontrada.');
        }


        res.status(200).json({ message: 'Endereço atualizado', venda });
    } catch (error: any) {
        const message = error.sqlMessage || error.message || 'Erro ao criar cliente!'
        res.json(message);
    }
});


const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
