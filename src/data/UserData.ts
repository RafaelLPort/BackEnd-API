import connection from '../config/connection';
import { User } from '../types/user';

export class UserData {
    public getUserByEmail = async (email_user: string): Promise<User | null> => {
        const result = await connection('customer').where({ email_user }).first();
        return result || null;
    };

    public createUser = async (user: User): Promise<void> => {
        await connection('customer').insert(user);
    };

    public getUserById = async (id_user: string): Promise<User | null> => {
        const result = await connection('customer').where({ id_user }).first();
        return result || null;
    };

    public addressUpdate = async (id_user: string, address: string): Promise<void> => {
    
        // Atualiza a tabela User com o endereço na coluna "address" associado ao "id_User"
        await connection('customer')
            .update({ address })
            .where({ id_user });
    };
    
}
