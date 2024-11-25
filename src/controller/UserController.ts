import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { v7 as uuidv7, validate } from 'uuid';
import connection from '../config/connection';


export class UserController {
    userBusiness = new UserBusiness();

    createCliente = async (req: Request, res: Response): Promise<void> => {
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

    getInfoByClienteId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_cliente } = req.params; // Obtém o id_cliente da URL

            // Chama a função de serviço para buscar o cliente
            const cliente = await this.userBusiness.getClienteById(id_cliente);

            // Retorna as informações do cliente
             res.status(200).json({ message: 'Informações do cliente', cliente });
        } catch (error: any) {
            const message = error.message || 'Erro ao buscar informações do cliente!';
             res.status(500).json({ message });
        }
    }

}
