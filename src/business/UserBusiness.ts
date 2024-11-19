import { UserData } from "../data/UserData";
import { generateId } from "../middlewares/idGenerator";
import { Cliente } from "../types/user";

export class UserBusiness {
    private userData = new UserData();

    public createCliente = async (nome_cliente: string, senha_cliente: string, email_cliente: string): Promise<Omit<Cliente, 'senha_cliente'>> => {
        // Verifica se os campos foram preenchidos
        if (!nome_cliente) {
            throw new Error('Campo "Nome" obrigatório, favor a preenchê-loo');
        }

        if (!senha_cliente) {
            throw new Error('Campo "Senha" obrigatório, favor preenchê-lo');
        }

        if (!email_cliente) {
            throw new Error('Campo "E-mail" obrigatório, favor preenchê-lo');
        }

        // Verifica se o cliente já existe
        const existingCliente = await this.userData.getClienteByEmail(email_cliente);
        if (existingCliente) {
            throw new Error('E-mail já cadastrado.');
        }

        // Criação do cliente
        const id_cliente = generateId(); // Substitui uuidv7
        await this.userData.createCliente({ id_cliente, nome_cliente, senha_cliente, email_cliente, endereco_cliente: "" });

        // Retorna os dados do cliente (exceto a senha)
        return { id_cliente, nome_cliente, email_cliente, endereco_cliente: "" };
    };
}
