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
}
