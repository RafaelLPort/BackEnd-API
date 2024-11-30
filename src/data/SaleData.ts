import connection from '../config/connection';

export class SaleData {
    
    public getReceiptById = async (ReceiptId: string) => {
        const result = await connection('cliente').where({ ReceiptId }).first();
        return result || null;
    };
}
