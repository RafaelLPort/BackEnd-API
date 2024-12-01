import { Request, Response } from 'express';
import { SaleBusiness } from '../business/SaleBusiness';

export class SaleController {
    saleBusiness = new SaleBusiness();

    // Buscar um produto pelo ID
    getReceiptById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { ReceiptId } = req.params;

            const Receipt = await this.saleBusiness.getReceiptById(ReceiptId);

            if (!Receipt) {
                res.status(404).json({ message: 'Receipt Not Found' });
                return;
            }

            res.status(200).json({ message: 'Receipt Found', Receipt });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Error finding product!';
            res.status(400).json({ error: message });
        }
    };

    createReceipt = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_product, id_user, total_price } = req.body;

            // Chama a camada de negócios para criar o Receipt
            const Receipt = await this.saleBusiness.createReceipt( id_product, id_user, total_price );
                

            res.status(201).json({ message: 'Receipt adicionado com sucesso', Receipt });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao adicionar Receipt!';
            res.status(400).json({ error: message });
        }
    };

}