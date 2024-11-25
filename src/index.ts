import express, { Request, Response } from 'express';
import cors from 'cors';
import { v7 as uuidv7, validate } from 'uuid';
import connection from './config/connection';
import { generateId } from './middlewares/idGenerator';
import { Produto } from './types/product';
import { Cliente } from './types/user';

const app = express();
app.use(cors());
app.use(express.json());


// CLIENTE

// // POST - Cria novo cliente
// app.post("/cliente", async(req: Request, res: Response) => {
//     try {
//         const { nome_cliente, senha_cliente, email_cliente} = req.body;

//         //VERIFICA SE OS CAMPOS FORAM PREENCHIDOS
//         if(!nome_cliente){
//             res.status(400)
//             throw new Error('Campo "Nome" obrigatório, favor preenchê-lo')
//         }

//         if(!senha_cliente){
//             res.status(400)
//             throw new Error('Campo "Senha" obrigatório, favor preenchê-lo')
//         }

//         if(!email_cliente){
//             res.status(400)
//             throw new Error('Campo "E-mail" obrigatório, favor preenchê-lo')
//         }

//         //LIMITAÇÃO DE CARACTERES NO NOME
//         if (nome_cliente.length < 2 || nome_cliente.length > 100) {
//             res.status(400);
//             throw new Error('O nome deve ter entre 2 e 100 caracteres.');
//         }

//         //VERIFICAÇÃO PARA NOME TER SOMENTE LETRAS
//         const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
//         if (!nomeRegex.test(nome_cliente)) {
//             res.status(400);
//             throw new Error('O campo "Nome" deve conter apenas letras.');
//         }

//         //VERIFICAÇÃO SE NOME CONTEM SOMENTE A TECLA ESPAÇO
//         if (!nome_cliente.trim()) {
//             res.status(400);
//             throw new Error('O campo "Nome" não pode conter apenas espaços.');
//         }

//         //VERIFICAÇÃO SE A SENHA TEM SÓ A TECLA ESPAÇO
//         if (!senha_cliente.trim()) {
//             res.status(400);
//             throw new Error('O campo "Senha" não pode conter apenas espaços.');
//         }

//         // VERIFICAÇÃO SE O E-MAIL É VÁLIDO
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email_cliente)) {
//             res.status(400);
//             throw new Error('O campo "E-mail" deve conter um endereço de e-mail válido.');
//         }

//         //VERIFICAÇÃO SE CLIENTE JÁ EXISTE
//         const existingCliente = await connection('cliente').where({ email_cliente });
//         if (existingCliente.length > 0) {
//             res.status(409)
//             throw new Error('E-mail já cadastrado.');
//         }

//         //CRIAÇÃO DO CLIENTE INSERÇÃO NO BD
//         const id_cliente = generateId();

//         const cliente: Cliente = {
//             id_cliente,
//             nome_cliente,
//             senha_cliente,
//             email_cliente,
//             endereco_cliente: ''
//         };

//         await connection('cliente').insert(cliente);

//         res.status(201).json({ message: 'Cliente criado com sucesso!', cliente: { id_cliente, nome_cliente, email_cliente } });
//     } catch (error: any) {
//         const message = error.sqlMessage || error.message || 'Erro ao criar cliente!'
//         res.json(message);
//     }
// });


// GET - Busca as informações de um cliente pelo ID
app.get('/cliente/infoCliente/:id_cliente', async (req: Request, res: Response) => {
    try {
        const { id_cliente } = req.params;

        //VERIFICAÇÃO DO ID FORNECIDO
        if (!id_cliente) {
            res.status(400)
            throw new Error('ID do cliente é obrigatório.');
        }

       //BUSCA NO BD
       const validateUUID = validate(id_cliente);
       if(!validateUUID){
        res.status(400)
        throw new Error("ID não encontrado, digite um ID válido.")
       }
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

        //LIMITAÇÃO DE CARACTERES NO NOME
        if (nome_produto.length < 2 || nome_produto.length > 100) {
            res.status(400);
            throw new Error('O nome do produto deve ter entre 2 e 100 caracteres.');
        }

        //VERIFICAÇÃO SE É NUMERO NOS CAMPOS DE PREÇO E ESTOQUE
        if (typeof preco_produto !== 'number' || typeof estoque_produto !== 'number') {
            res.status(400)
            throw new Error('preco_produto e estoque_produto devem ser números.');
        }

        //VERIFICAÇÃO SE NOME DO PRODUTO, CATEGORIA E DESCRIÇÃO TEM SOMENTE A TECLA ESPAÇO DIGITADA NO CAMPO
        if (!nome_produto.trim()) {
            res.status(400);
            throw new Error('O campo "nome_produto" não pode conter apenas espaços.');
        }

        if (!categoria_produto.trim()) {
            res.status(400);
            throw new Error('O campo "categoria_produto" não pode conter apenas espaços.');
        }

        if (!desc_produto.trim()) {
            res.status(400);
            throw new Error('O campo "desc_produto" não pode conter apenas espaços.');
        }

        // VALIDAÇÃO DO FORMATO DA CATEGORIA
        const categoriaRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (!categoriaRegex.test(categoria_produto)) {
            res.status(400);
            throw new Error('O campo "categoria_produto" deve conter apenas letras.');
        }

        // VALIDAÇÃO PARA PREÇO E ESTOQUE PARA QUE NAO ACEITE VALORES NEGATIVOS

        if (preco_produto < 0) {
            res.status(400);
            throw new Error('O campo "preco_produto" não pode ser negativo.');
        }
        
        if (!Number.isInteger(estoque_produto) || estoque_produto < 0) {
            res.status(400);
            throw new Error('O campo "estoque_produto" deve ser um número inteiro não negativo.');
        }
        

        // CRIAÇÃO DO PRODUTO
        const id_produto = generateId();
        const produto: Produto = {
            id_produto,
            nome_produto,
            desc_produto,
            preco_produto,
            categoria_produto,
            estoque_produto,
        };

        await connection('produto').insert(produto);


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

        //CONSULTA NO BD COM A VALIDAÇÃO
        const validateUUID = validate(produtoId);
        if(!validateUUID){
        res.status(400)
        throw new Error("ID não encontrado, digite um ID válido.")
       }
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


// GET - Busca produtos por nome e/ou categoria e ordenação
app.get('/produtoscomfiltro', async (req: Request, res: Response) => {
    try {
        const nome_produto = req.query.nome_produto as string | undefined;
        const categoria_produto = req.query.categoria_produto as string | undefined;
        const ordem = req.query.ordem as string | undefined;

        if (!nome_produto && !categoria_produto && !ordem) {
            res.status(400);
            throw new Error('É necessário informar pelo menos o nome do produto, categoria ou ordem.')
        }
        
        //VALIDAÇÃO SE CAMPO FOI PRENCHIDO SOMENTE COM A TECLA ESPAÇO
        if (nome_produto && nome_produto.trim().length === 0) {
            res.status(400);
            throw new Error('O campo "nome_produto" não pode conter apenas espaços.');
        }

        if (categoria_produto && categoria_produto.trim().length === 0) {
            res.status(400);
            throw new Error('O campo "categoria_produto" não pode conter apenas espaços.');
        }

        if (ordem && ordem.trim().length === 0) {
            res.status(400);
            throw new Error('O campo "ordem" não pode conter apenas espaços.');
        }
        // Inicializa a consulta no banco de dados
        let query = connection('produto');

        // FILTRAGEM POR NOME
        if (nome_produto) {
            query = query.where('nome_produto', 'ilike', `%${nome_produto}%`);
        }



        // FILTRAGEM POR CATEGORIA - COM VERIFICAÇÃO PARA ACEITAR APENAS LETRAS
        if (categoria_produto) {
            const categoriaRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
            if (!categoriaRegex.test(categoria_produto)) {
                res.status(400);
                throw new Error('O campo "Categoria" deve conter apenas letras.');
            }
            query = query.where('categoria_produto', 'ilike', `%${categoria_produto}%`);
        }

        // FILTRAGEM ASC OU DESC - COM VERIFICAÇÃO SE É 'ASC' OU 'DESC'
        if (ordem) {
            const ordemValida = ordem.toLowerCase();
            if (ordemValida !== 'asc' && ordemValida !== 'desc') {
                res.status(400);
                throw new Error('O campo "Ordem" aceita somente as palavras "asc" ou "desc".');
            }

            // APLICA A ORDENAÇÃO
            query = query.orderBy('nome_produto', ordemValida);
        }

        const produtos = await query;

        if (produtos.length === 0) {
            res.status(404);
            throw new Error('Nenhum produto encontrado com os filtros especificados.');
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
        const validateUUID = validate(produtoId);
        if(!validateUUID){
        res.status(400)
        throw new Error("ID não encontrado, digite um ID válido.")
       }
       
        const produto = await connection('produto').where({ id_produto: produtoId }).first();
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

        //VALIDAÇÃO SE CAMPO FOI PRENCHIDO SOMENTE COM A TECLA ESPAÇO
        if (nome && nome.trim().length === 0) {
            res.status(400);
            throw new Error('O campo "nome_produto" não pode conter apenas espaços.');
        }

        // Verifica se o produto existe
        const validateUUID = validate(produtoId);
        if(!validateUUID){
        res.status(400)
        throw new Error("ID não encontrado, digite um ID válido.")
       }

        //VERIFICA SE O PREÇO É POSITIVO OU IGUAL A ZERO
        if(preco &&(typeof preco !== 'number' || preco < 0)){
            res.status(400);
            throw new Error('O campo "preço" deve ser um número maior ou igual a zero.')
        }

        //VERIFICA SE O ESTOQUE É NUMERO INTEIRO OU MAIOR Q ZERO
        if(estoque && (!Number.isInteger(estoque) || estoque < 0)){
            res.status(400);
            throw new Error('O campo "estoque" deve ser um número inteiro maior ou igual a zero.')
        }

        //VERIFICA SE PELO MENOS UM CAMPO FOI PREENCHIDO
        if (!nome && preco && estoque === undefined) {
            res.status(400);
            throw new Error('Informe pelo menos um campo para atualizar.');
        }
        

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
