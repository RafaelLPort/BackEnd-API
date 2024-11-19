import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';

export class UserController {
    private userBusiness = new UserBusiness();

    public createCliente = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome_cliente, senha_cliente, email_cliente } = req.body;

            // Chama a camada de negócios para criar o cliente
            const cliente = await this.userBusiness.createCliente(nome_cliente, senha_cliente, email_cliente);

            res.status(201).json({ message: 'Cliente criado com sucesso!', cliente });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Erro ao criar cliente!';
            res.status(400).json({ error: message });
        }
    };
}
