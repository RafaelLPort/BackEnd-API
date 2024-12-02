import { SaleData } from "../data/SaleData";
import { generateId } from "../middlewares/idGenerator";
import { validate } from 'uuid';


export class SaleBusiness {
    SaleData = new SaleData();


    getReceiptById = async (ReceiptId: string) => {
      // Verify if ReceiptId is provided
      if (!ReceiptId) {
          throw new Error('"Receipt ID is required."');
      }

      // Verify if the ID is a valid UUID
      const validateUUID = validate(ReceiptId);
      if (!validateUUID) {
          throw new Error('invalid ID .');
      }

      // Fetch Receipt from the database
      const Receipt = await this.SaleData.getReceiptById(ReceiptId);

      // Check if the Receipt exists
      if (!Receipt) {
          throw new Error('Receipt not found.');
      }

      return Receipt;
    };


    createReceipt = async ( id_product: string, id_user: string, total_price: number) => {

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
    
        //VERIFICAÇÃO SE NOME DO Product, CATEGORIA E DESCRIÇÃO TEM SOMENTE A TECLA ESPAÇO DIGITADA NO CAMPO
        if (!id_product.trim()) {
          throw new Error("The total_price must be a valid number.");
        }
        
        if (!id_user.trim()) {
            throw new Error(
                "The field 'id_user' cannot contain only spaces."
            );
        }

        if (total_price < 0) {
          throw new Error('The "total_price" field cannot be negative.');
        }


        // Verifica se o ID é válido
        const validateUser = validate(id_user);
        if (!validateUser) {
            throw new Error("Invalid ID.");
        }

        // Busca o user no banco de dados
        const user = await this.SaleData.getUserById(id_user);

        // Verifica se o user foi encontrado
        if (!user) {
            throw new Error('User not found.');
        }

          // Verifica se o ID é válido
          const validateProduct = validate(id_product);
          if (!validateProduct) {
            throw new Error('Invalid ID.');
          }
      
          // Busca o Product no banco de dados
          const Product = await this.SaleData.getProductById(id_product);
      
          // Verifica se o Product foi encontrado
          if (!Product) {
            throw new Error('Product not found.');
          }
    

        await this.SaleData.createReceipt({
          id_receipt: generateId(), // Ou use o id_Product se for gerado externamente
          id_product,
          id_user,
          total_price
        });
      };

}