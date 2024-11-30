import { SaleData } from "../data/SaleData";
import { v7 as uuidv7, validate } from 'uuid';

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

}