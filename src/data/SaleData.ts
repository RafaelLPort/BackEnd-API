import connection from '../config/connection';
import { receipt } from '../types/receipt';
import { Cliente } from '../types/user';
import { Produto } from '../types/product';

export class SaleData {
    
    public getReceiptById = async (ReceiptId: string) => {
        const result = await connection('receipt').where({ ReceiptId }).first();
        return result || null;
    };

    public createReceipt = async (receipt: receipt): Promise<void> => {
        await connection('receipt').insert(receipt);
    };


    
    //acessos ao BD de verificacao de existencia

    public getClienteById = async (id_cliente: string): Promise<Cliente | null> => {
        const result = await connection('cliente').where({ id_cliente }).first();
        return result || null;
    };

    // Método para buscar um produto por ID
    getProdutoById = async (id_produto: string): Promise<Produto | null> => {
        const result = await connection('produto').where({ id_produto }).first();
        return result || null;
    };
}
