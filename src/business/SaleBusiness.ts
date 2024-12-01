import { SaleData } from "../data/SaleData";
import { generateId } from "../middlewares/idGenerator";
import { v7 as uuidv7, validate } from 'uuid';
import { UserData } from "../data/UserData";
import { Cliente } from "../types/user";


export class SaleBusiness {
    SaleData = new SaleData();

    getReceiptById = async (ReceiptId: string) => {

        //VERIFICAÇÃO DO ID FORNECIDO
        if (!ReceiptId) {
            throw new Error('ID do Receipt é obrigatório.');
        }

        // Verifica se o ID é válido
        const validateUUID = validate(ReceiptId);
        if (!validateUUID) {
            throw new Error('ID inválido.');
        }

        // Busca o Receipt no banco de dados
        const Receipt = await this.SaleData.getReceiptById(ReceiptId);

        // Verifica se o Receipt foi encontrado
        if (!Receipt) {
            throw new Error('Receipt não encontrado.');
        }

        return Receipt;
    };



    

    createReceipt = async (
        id_product: string,
        id_user: string,
        total_price: number,
      ) => {
        //VERIFICA SE TODOS OS CAMPOS FORAM PREENCHIDOS
        if (
          !id_product ||
          !id_user ||
          !total_price
        ) {
          throw new Error("Please fill out all fields.");
        }
    
        //VERIFICAÇÃO SE É NUMERO NOS CAMPOS DE PREÇO E ESTOQUE
        if ( typeof total_price !== "number" ) {
          throw new Error("The total_price must be a number.");
        }
    
        //VERIFICAÇÃO SE NOME DO PRODUTO, CATEGORIA E DESCRIÇÃO TEM SOMENTE A TECLA ESPAÇO DIGITADA NO CAMPO
        if (!id_product.trim()) {
          throw new Error('O campo "id_product" não pode conter apenas espaços.');
        }
        
        if (!id_user.trim()) {
            throw new Error(
                'O campo "id_user" não pode conter apenas espaços.'
            );
        }
        
        if (!id_user) {
            throw new Error('ID do user é obrigatório.');
        }
        
        if (!id_product) {
            throw new Error('ID do produto é obrigatório.');
        }
        
        if (total_price < 0) {
          throw new Error('The "total_price" field cannot be negative.');
        }

        if (!total_price) {
            throw new Error('o preco total é obrigatório.');
        }



        //Verificacao do id do user

        // Verifica se o ID é válido
        const validateUser = validate(id_user);
        if (!validateUser) {
            throw new Error('ID inválido.');
        }

        // Busca o user no banco de dados
        const user = await this.SaleData.getClienteById(id_user);

        // Verifica se o user foi encontrado
        if (!user) {
            throw new Error('user não encontrado.');
        }


        //Verificacao do id do produto
        
          // Verifica se o ID é válido
          const validateProduct = validate(id_product);
          if (!validateProduct) {
            throw new Error("ID inválido.");
          }
      
          // Busca o Produto no banco de dados
          const Produto = await this.SaleData.getProdutoById(id_product);
      
          // Verifica se o Produto foi encontrado
          if (!Produto) {
            throw new Error("Produto não encontrado.");
          }


    
        // VALIDAÇÃO PARA QUE O PREÇO PARA QUE NAO ACEITE VALORES NEGATIVOS
    
    
        await this.SaleData.createReceipt({
          id_receipt: generateId(), // Ou use o id_produto se for gerado externamente
          id_product,
          id_user ,
          total_price
        });
      };

}