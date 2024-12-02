import connection from '../config/connection';
import { receipt } from '../types/receipt';
import { User } from '../types/user';
import { Product } from '../types/product';

export class SaleData {
    
    public getReceiptById = async (id_receipt: string) => {
        const result = await connection('sale').where({ id_receipt }).first();
        return result || null;
    };

    public createReceipt = async (receipt: receipt): Promise<void> => {
        await connection('sale').insert(receipt);
    };

    //acessos ao BD de verificacao de existencia

    public getUserById = async (id_user: string): Promise<User | null> => {
        const result = await connection('customer').where({ id_user }).first();
        return result || null;
    };

    // Método para buscar um Product por ID
    getProductById = async (id_product: string): Promise<Product | null> => {
        const result = await connection('product').where({ id_product }).first();
        return result || null;
    };
}
