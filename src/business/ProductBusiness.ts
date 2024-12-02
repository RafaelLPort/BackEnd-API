import { ProductData } from "../data/ProductData";
import { generateId } from "../middlewares/idGenerator";
import { Product } from "../types/product";
import { validate } from "uuid";

export class ProductBusiness {
  ProductData = new ProductData();


  // Cria Product
  createProduct = async (
    name_product: string,
    desc_product: string,
    price_product: number,
    category_product: string,
    stock_product: number
  ) => {
    //VERIFICA SE TODOS OS CAMPOS FORAM PREENCHIDOS
    if (
      !name_product ||
      !desc_product ||
      !price_product ||
      !category_product ||
      !stock_product
    ) {
      throw new Error("Fill in all the fields.");
    }

    //LIMITAÇÃO DE CARACTERES NO NOME
    if (name_product.length < 2 || name_product.length > 100) {
      throw new Error("The product name must be between 2 and 100 characters.");
    }

    //VERIFICAÇÃO SE É NUMERO NOS CAMPOS DE PREÇO E ESTOQUE
    if (
      typeof price_product !== "number" ||
      typeof stock_product !== "number"
    ) {
      throw new Error("price_product and stock_product must be numbers.");
    }

    //VERIFICAÇÃO SE NOME DO Product, CATEGORIA E DESCRIÇÃO TEM SOMENTE A TECLA ESPAÇO DIGITADA NO CAMPO
    if (!name_product.trim()) {
      throw new Error('The "name_product" field cannot contain only spaces.');
    }

    if (!category_product.trim()) {
      throw new Error( 'The "category_product" field must contain only letters.' );
    }

    if (!desc_product.trim()) {
      throw new Error("The 'desc_product' field cannot contain only spaces.");
    }

    // VALIDAÇÃO DO FORMATO DA CATEGORIA
    const categoriaRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!categoriaRegex.test(category_product)) {
      throw new Error('The "category_product" field must contain only letters.');
    }

    // VALIDAÇÃO PARA PREÇO E ESTOQUE PARA QUE NAO ACEITE VALORES NEGATIVOS

    if (price_product < 0) {
      throw new Error('The "price_product" field cannot be negative.');
    }

    if (!Number.isInteger(stock_product) || stock_product < 0) {
      throw new Error( 'The "stock_product" field must be a non-negative integer.' );
    }

    const newProduct: Product = {
      id_product: generateId(), // Ou use o id_product se for gerado externamente
      name_product,
      desc_product,
      price_product,
      category_product,
      stock_product,
  };

    await this.ProductData.createProduct(newProduct);
  };


//Puxa todos os Products
  getAllProducts = async (numPage: number, itemsPerPage: number) => {
    const offset = (numPage - 1) * itemsPerPage; // Calculando o offset
    const Products = await this.ProductData.getAllProducts(offset, itemsPerPage);  // Passando 'offset' e 'itemsPerPage'
    return Products;
  };



  getProductById = async (productId: string) => {
    //VERIFICAÇÃO DO ID FORNECIDO

    console.log(productId);

    if (!productId) {
      throw new Error( "Product ID is required." );
    }

    // Verifica se o ID é válido
    const validateUUID = validate(productId);
    if (!validateUUID) {
      throw new Error("Invalid ID.");
    }

    // Busca o Product no banco de dados
    const Product = await this.ProductData.getProductById(productId);

    // Verifica se o Product foi encontrado
    if (!Product) {
      throw new Error(" Product not found. ");
    }

    return Product;
  };


//atualiza os Products
  updateProduct = async (
    id_product: string,
    name_product: string,
    price_product: number,
    desc_product: string,
    category_product: string,
    stock_product: number
  ) => {

    
    
    //VERIFICAÇÃO SE PREENCHEU O ID DO Product
    if (!id_product) {
      throw new Error("Fill in the product ID.");
    }

    // Verifica se o Product existe
    const validateUUID = validate(id_product);
    if (!validateUUID) {
      throw new Error("ID not found, please enter a valid ID.");
    }

    //VALIDAÇÃO SE OS CAMPOS FORAM PRENCHIDOS SOMENTE COM A TECLA ESPAÇO

    if (name_product && name_product.trim().length === 0) {
      throw new Error("The name_product field cannot contain only spaces.");
    }

    if (desc_product && desc_product.trim().length === 0) {
      throw new Error( "The desc_product field cannot contain only spaces." );
    }

    if (category_product && category_product.trim().length === 0) {
      throw new Error( "The category_product field cannot contain only spaces." );
    }
  

    //VERIFICA SE O PREÇO É POSITIVO OU IGUAL A ZERO
    if (
      price_product &&
      (typeof price_product !== "number" || price_product < 0)
    ) {
      throw new Error( "The price field must be a number greater than or equal to zero." );
    }

    //VERIFICA SE O ESTOQUE É NUMERO INTEIRO OU MAIOR Q ZERO
    if (
      stock_product &&
      (!Number.isInteger(stock_product) || stock_product < 0)
    ) {
      throw new Error( "The stock_product field must be an integer greater than or equal to zero." );
    }

    //VERIFICA SE PELO MENOS UM CAMPO FOI PREENCHIDO
    if (!name_product && price_product && stock_product === undefined) {
      throw new Error("Please provide at least one field to update.");
    }

    //VERIFICA SE O Product EXISTE
    const productVerification = await this.ProductData.getProductById(id_product);
    
    if (!productVerification) {
        throw new Error( "Product not found." );
    }


    //FAZ O UPDATE
    await this.ProductData.updateProduct(id_product,name_product,price_product,desc_product,category_product,stock_product);

  };


//Puxa os Products com base nos filtros
  getProductWithFilter = async (name_product:string ,category_product: string, Order: string, numPage: number, itemsPerPage: number) => {
    
    if (!name_product && !category_product && !Order) {
        throw new Error("You must provide at least the product name, category, or order.")
    }

    //testar se 1 estiver escrito e algum outro tiver so com espaco ou vazio

    //VALIDAÇÃO SE CAMPO FOI PRENCHIDO SOMENTE COM A TECLA ESPAÇO
    if (name_product && name_product.trim().length === 0) {
        throw new Error( "The name_product field cannot contain only spaces.");
    }

    if (category_product && category_product.trim().length === 0) {
        throw new Error("The category_product field cannot contain only spaces.");
    }

    if (Order && Order.trim().length === 0) {
        throw new Error( "The order field cannot contain only spaces.");
    }


    // Busca o Product no banco de dados
    const offset = (numPage - 1) * itemsPerPage; // Calculando o offset
    const Product = await this.ProductData.getProductWithFilter(offset, itemsPerPage, name_product, category_product, Order);

    // Verifica se o Product foi encontrado
    if (!Product) {
      throw new Error( "Product not found." );
    }

    return Product;
  };



  // DELETAR Product POR ID
  deleteProductById = async (id_product: string) => {
    //VERIFICAÇÃO DO ID FORNECIDO
    if (!id_product) {
      throw new Error( "Product ID is required.");
    }

    // Verifica se o ID é válido
    const validateUUID = validate(id_product);
    if (!validateUUID) {
      throw new Error("Invalid ID.");
    }

    // deleta o Product no banco de dados
    await this.ProductData.deleteProductById(id_product);

    // Verifica se o Product foi encontrado
  };
}
