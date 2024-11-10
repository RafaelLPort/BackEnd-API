"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const connection_1 = __importDefault(require("./config/connection"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/cliente", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome_cliente, senha_cliente, email_cliente } = req.body;
        if (!nome_cliente || !senha_cliente || !email_cliente) {
            throw new Error('Preencha todos os campos.');
        }
        const existingCliente = yield (0, connection_1.default)('cliente').where({ email_cliente });
        if (existingCliente) {
            res.status(401);
            throw new Error('Cliente já existe.');
        }
        const id_cliente = (0, uuid_1.v7)();
        yield (0, connection_1.default)('cliente').insert({
            id_cliente,
            nome_cliente,
            senha_cliente,
            email_cliente
        });
        res.status(201).json({ message: 'Cliente criado com sucesso!', cliente: { id_cliente, nome_cliente, email_cliente } });
    }
    catch (error) {
        const message = error.sqlMessage || error.message || 'Erro ao criar cliente!';
        res.json(message);
    }
}));
app.get('/cliente/infoCliente/:id_cliente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_cliente } = req.params;
        if (!id_cliente) {
            throw new Error('ID do cliente é obrigatório.');
        }
        const cliente = yield (0, connection_1.default)('cliente').where({ id_cliente });
        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }
        res.status(200).json({ message: 'Informações do cliente', cliente });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar informações do cliente', error: error.message });
    }
}));
app.post('/produto', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome_produto, desc_produto, preco_produto, categoria_produto, estoque_produto } = req.body;
        if (!nome_produto || !desc_produto || !preco_produto || !categoria_produto || !estoque_produto) {
            throw new Error('Preencha todos os campos.');
        }
        if (typeof preco_produto !== 'number' || typeof estoque_produto !== 'number') {
            throw new Error('preco_produto e estoque_produto devem ser números.');
        }
        const id_produto = (0, uuid_1.v7)();
        yield (0, connection_1.default)('produto').insert({
            id_produto,
            nome_produto,
            desc_produto,
            preco_produto,
            categoria_produto,
            estoque_produto
        });
        res.status(201).json({ message: 'Produto adicionado com sucesso', produto: { id_produto, nome_produto, desc_produto, preco_produto, categoria_produto, estoque_produto } });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
    }
}));
app.get('/produtos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produtos = yield (0, connection_1.default)('produto').select('*');
        res.status(200).json({ message: 'Todos os produtos', produtos });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todos os produtos', error: error.message });
    }
}));
app.get('/produtos/:produtoId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { produtoId } = req.params;
        const produto = yield (0, connection_1.default)('produto').where({ id_produto: produtoId });
        if (!produto) {
            throw new Error('Produto não encontrado.');
        }
        res.status(200).json({ message: 'Produto encontrado', produto });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produto!', error: error.message });
    }
}));
app.get('/produtoscomfiltro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome_produto, categoria_produto, ordem } = req.query;
        let query = (0, connection_1.default)('produto');
        if (nome_produto) {
            query = query.where('nome_produto', 'ilike', `%${nome_produto}%`);
        }
        if (categoria_produto) {
            query = query.where('categoria_produto', 'ilike', `%${categoria_produto}%`);
        }
        if (ordem) {
            const direcaoValida = ['asc', 'desc'].includes(ordem.toLowerCase()) ? ordem.toLowerCase() : 'asc';
            query = query.orderBy('nome_produto', direcaoValida);
        }
        const produtos = yield query;
        res.status(200).json({ message: 'Produtos encontrados', produtos });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os produtos', error: error.message });
    }
}));
app.delete("/produtos/:produtoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { produtoId } = req.params;
        const produto = yield (0, connection_1.default)('produto').where({ id_produto: produtoId });
        if (!produto) {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
        yield (0, connection_1.default)('produto').where({ id_produto: produtoId }).delete();
        res.status(200).json({ message: 'Produto deletado com sucesso', produtoId });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
    }
}));
app.patch('/produtos/:produtoId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { produtoId } = req.params;
        const { nome, preco, estoque } = req.body;
        if (!produtoId) {
            res.status(400).json({ message: 'Preencha o produtoId.' });
        }
        const produto = yield (0, connection_1.default)('produto').where({ id_produto: produtoId }).first();
        if (!produto) {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
        yield (0, connection_1.default)('produto')
            .where({ id_produto: produtoId })
            .update({
            nome_produto: nome !== null && nome !== void 0 ? nome : produto.nome_produto,
            preco_produto: preco !== null && preco !== void 0 ? preco : produto.preco_produto,
            estoque_produto: estoque !== null && estoque !== void 0 ? estoque : produto.estoque_produto,
        });
        const produtoAtualizado = yield (0, connection_1.default)('produto').where({ id_produto: produtoId }).first();
        res.status(200).json({ message: 'Produto atualizado com sucesso', produto: produtoAtualizado });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
    }
}));
app.get('/vendas/:vendaId/revisao', (req, res) => {
    try {
        const { vendaId } = req.params;
        const venda = {};
        if (!venda) {
            throw new Error('Venda não encontrada.');
        }
        res.status(200).json({ message: 'Revisão da venda', detalhes: venda });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar detalhes da venda', error: error.message });
    }
});
app.put('/vendas/:vendaId/endereco', (req, res) => {
    try {
        const { vendaId } = req.params;
        const { endereco } = req.body;
        const venda = {};
        if (!venda) {
            throw new Error('Venda não encontrada.');
        }
        res.status(200).json({ message: 'Endereço atualizado', venda });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar endereço', error: error.message });
    }
});
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map