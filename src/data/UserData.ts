import connection from '../config/connection';
import { Cliente } from '../types/user';

export class UserData {
    public getClienteByEmail = async (email_cliente: string): Promise<Cliente | null> => {
        const result = await connection('cliente').where({ email_cliente }).first();
        return result || null;
    };

    public createCliente = async (cliente: Cliente): Promise<void> => {
        await connection('cliente').insert(cliente);
    };

    public getClienteById = async (id_cliente: string): Promise<Cliente | null> => {
        const result = await connection('cliente').where({ id_cliente }).first();
        return result || null;
    };

    public addressUpdate = async (id_cliente: string, endereco_cliente: string): Promise<void> => {
    
        // Atualiza a tabela cliente com o endereço na coluna "address" associado ao "id_Cliente"
        await connection('cliente')
            .update({ endereco_cliente })
            .where({ id_cliente });
    };
    
}
