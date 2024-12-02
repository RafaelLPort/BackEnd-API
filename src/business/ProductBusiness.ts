import { ProductData } from "../data/ProductData";
import { generateId } from "../middlewares/idGenerator";
import { Produto } from "../types/product";
import { v7 as uuidv7, validate } from "uuid";

export class ProdutoBusiness {
  ProdutoData = new ProductData();

  createProduct = async (
    nome_produto: string,
    desc_produto: string,
    preco_produto: number,
    categoria_produto: string,
    estoque_produto: number
  ) => {
    //VERIFICA SE TODOS OS CAMPOS FORAM PREENCHIDOS
    if (
      !nome_produto ||
      !desc_produto ||
      !preco_produto ||
      !categoria_produto ||
      !estoque_produto
    ) {
      throw new Error("Preencha todos os campos.");
    }

    //LIMITAÇÃO DE CARACTERES NO NOME
    if (nome_produto.length < 2 || nome_produto.length > 100) {
      throw new Error("O nome do produto deve ter entre 2 e 100 caracteres.");
    }

    //VERIFICAÇÃO SE É NUMERO NOS CAMPOS DE PREÇO E ESTOQUE
    if (
      typeof preco_produto !== "number" ||
      typeof estoque_produto !== "number"
    ) {
      throw new Error("preco_produto e estoque_produto devem ser números.");
    }

    //VERIFICAÇÃO SE NOME DO PRODUTO, CATEGORIA E DESCRIÇÃO TEM SOMENTE A TECLA ESPAÇO DIGITADA NO CAMPO
    if (!nome_produto.trim()) {
      throw new Error('O campo "nome_produto" não pode conter apenas espaços.');
    }

    if (!categoria_produto.trim()) {
      throw new Error(
        'O campo "categoria_produto" não pode conter apenas espaços.'
      );
    }

    if (!desc_produto.trim()) {
      throw new Error('O campo "desc_produto" não pode conter apenas espaços.');
    }

    // VALIDAÇÃO DO FORMATO DA CATEGORIA
    const categoriaRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!categoriaRegex.test(categoria_produto)) {
      throw new Error('O campo "categoria_produto" deve conter apenas letras.');
    }

    // VALIDAÇÃO PARA PREÇO E ESTOQUE PARA QUE NAO ACEITE VALORES NEGATIVOS

    if (preco_produto < 0) {
      throw new Error('O campo "preco_produto" não pode ser negativo.');
    }

    if (!Number.isInteger(estoque_produto) || estoque_produto < 0) {
      throw new Error(
        'O campo "estoque_produto" deve ser um número inteiro não negativo.'
      );
    }

    const newProduct: Produto = {
      id_produto: generateId(), // Ou use o id_produto se for gerado externamente
      nome_produto,
      desc_produto,
      preco_produto,
      categoria_produto,
      estoque_produto,
  };

    await this.ProdutoData.createProduct(newProduct);
  };

  getAllProdutos = async (numPage: number, itemsPerPage: number) => {
    const offset = (numPage - 1) * itemsPerPage; // Calculando o offset
    const produtos = await this.ProdutoData.getAllProdutos(offset, itemsPerPage);  // Passando 'offset' e 'itemsPerPage'
    return produtos;
  };

  getProdutoById = async (produtoId: string) => {
    //VERIFICAÇÃO DO ID FORNECIDO
    if (!produtoId) {
      throw new Error("ID do Produto é obrigatório.");
    }

    // Verifica se o ID é válido
    const validateUUID = validate(produtoId);
    if (!validateUUID) {
      throw new Error("ID inválido.");
    }

    // Busca o Produto no banco de dados
    const Produto = await this.ProdutoData.getProdutoById(produtoId);

    // Verifica se o Produto foi encontrado
    if (!Produto) {
      throw new Error("Produto não encontrado.");
    }

    return Produto;
  };





  // alterar os tipos e os nomes abaixo

  updateProduto = async (
    id_produto: string,
    nome_produto: string,
    preco_produto: number,
    desc_produto: string,
    categoria_produto: string,
    estoque_produto: number
  ) => {

    
    
    //VERIFICAÇÃO SE PREENCHEU O ID DO PRODUTO
    if (!id_produto) {
      throw new Error("Preencha o ID do produto.");
    }

    // Verifica se o produto existe
    const validateUUID = validate(id_produto);
    if (!validateUUID) {
      throw new Error("ID não encontrado, digite um ID válido.");
    }

    //VALIDAÇÃO SE OS CAMPOS FORAM PRENCHIDOS SOMENTE COM A TECLA ESPAÇO

    if (nome_produto && nome_produto.trim().length === 0) {
      throw new Error(
        'O campo "nome_produto" não pode conter apenas espaços.'
      );
    }

    if (desc_produto && desc_produto.trim().length === 0) {
      throw new Error(
        'O campo "desc_produto" não pode conter apenas espaços.'
      );
    }

    if (categoria_produto && categoria_produto.trim().length === 0) {
      throw new Error(
        'O campo "categoria_produto" não pode conter apenas espaços.'
      );
    }
  

    //VERIFICA SE O PREÇO É POSITIVO OU IGUAL A ZERO
    if (
      preco_produto &&
      (typeof preco_produto !== "number" || preco_produto < 0)
    ) {
      throw new Error(
        'O campo "preço" deve ser um número maior ou igual a zero.'
      );
    }

    //VERIFICA SE O ESTOQUE É NUMERO INTEIRO OU MAIOR Q ZERO
    if (
      estoque_produto &&
      (!Number.isInteger(estoque_produto) || estoque_produto < 0)
    ) {
      throw new Error(
        'O campo "estoque_produto" deve ser um número inteiro maior ou igual a zero.'
      );
    }

    //VERIFICA SE PELO MENOS UM CAMPO FOI PREENCHIDO
    if (!nome_produto && preco_produto && estoque_produto === undefined) {
      throw new Error("Informe pelo menos um campo para atualizar.");
    }

    //VERIFICA SE O PRODUTO EXISTE
    const productVerification = await this.ProdutoData.getProdutoById(id_produto);
    
    if (!productVerification) {
        throw new Error("Produto não encontrado.");
    }


    //FAZ O UPDATE
    await this.ProdutoData.updateProduto(id_produto,nome_produto,preco_produto,desc_produto,categoria_produto,estoque_produto);

  };



  getProdutoWithFilter = async (nome_produto:string ,categoria_produto: string, ordem: string, numPage: number, itemsPerPage: number) => {
    
    if (!nome_produto && !categoria_produto && !ordem) {
        throw new Error('É necessário informar pelo menos o nome do produto, categoria ou ordem.')
    }

    //testar se 1 estiver escrito e algum outro tiver so com espaco ou vazio

    //VALIDAÇÃO SE CAMPO FOI PRENCHIDO SOMENTE COM A TECLA ESPAÇO
    if (nome_produto && nome_produto.trim().length === 0) {
        throw new Error('O campo "nome_produto" não pode conter apenas espaços.');
    }

    if (categoria_produto && categoria_produto.trim().length === 0) {
        throw new Error('O campo "categoria_produto" não pode conter apenas espaços.');
    }

    if (ordem && ordem.trim().length === 0) {
        throw new Error('O campo "ordem" não pode conter apenas espaços.');
    }

    console.log("NumPage: ", numPage);

    // Busca o Produto no banco de dados
    const offset = (numPage - 1) * itemsPerPage; // Calculando o offset
    const Produto = await this.ProdutoData.getProdutoWithFilter(offset, itemsPerPage, nome_produto, categoria_produto, ordem);

    // Verifica se o Produto foi encontrado
    if (!Produto) {
      throw new Error("Produto não encontrado.");
    }

    return Produto;
  };





  

  // DELETAR PRODUTO POR ID

  deleteProdutoById = async (id_Produto: string) => {
    //VERIFICAÇÃO DO ID FORNECIDO
    if (!id_Produto) {
      throw new Error("ID do Produto é obrigatório.");
    }

    // Verifica se o ID é válido
    const validateUUID = validate(id_Produto);
    if (!validateUUID) {
      throw new Error("ID inválido.");
    }

    // deleta o Produto no banco de dados
    await this.ProdutoData.deleteProdutoById(id_Produto);

    // Verifica se o Produto foi encontrado
  };
}
