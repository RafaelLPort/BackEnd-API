import { UserData } from "../data/UserData";
import { generateId } from "../middlewares/idGenerator";
import { User } from "../types/user";
import { validate } from 'uuid';
import bcrypt from "bcryptjs";

export class UserBusiness {
    userData = new UserData();

    createUser = async (name_user: string, password_user: string, email_user: string): Promise<Omit<User, 'password_user'>> => {
        // Verifica se os campos foram preenchidos
        if (!name_user) {
            throw new Error( "Field 'Name' is required, please fill it in." );
        }

        if (!password_user) {
            throw new Error("Field 'Password' is required, please fill it in.");
        }

        if (!email_user) {
            throw new Error("Field 'email' is required, please fill it in.");
        }

        //LIMITAÇÃO DE CARACTERES NO NOME
        if (name_user.length < 2 || name_user.length > 100) {
            throw new Error("The name must be between 2 and 100 characters.");
        }

        //VERIFICAÇÃO PARA NOME TER SOMENTE LETRAS
        const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (!nomeRegex.test(name_user)) {
            throw new Error("The 'Name' field must contain only letters.");
        }

        //VERIFICAÇÃO SE NOME CONTEM SOMENTE A TECLA ESPAÇO
        if (!name_user.trim()) {
            throw new Error("The 'Name' field cannot contain only spaces.");
        }

        //VERIFICAÇÃO SE A SENHA TEM SÓ A TECLA ESPAÇO
        if (!password_user.trim()) {
            throw new Error("The 'Password' field cannot contain only spaces.");
        }

        // VERIFICAÇÃO SE O E-MAIL É VÁLIDO
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_user)) {
            throw new Error("The 'Email' field must contain a valid email address.");
        }

        // Verifica se o User já existe
        const existingUser = await this.userData.getUserByEmail(email_user);
        if (existingUser) {
            throw new Error("Email already registered.");
        }

        const hashedPassword = await bcrypt.hash(password_user, 10);
        
        // Criação do User
        const newUser: User = {
            id_user: generateId(),
            name_user,
            email_user,
            password_user: hashedPassword
        };

        await this.userData.createUser(newUser);


        // Retorna os dados do User (exceto a senha)
        return newUser;
    };

    getUserById = async (id_user: string): Promise<User | null> => {

        //VERIFICAÇÃO DO ID FORNECIDO
        if (!id_user) {
            throw new Error("User ID is required.");
        }

        // Verifica se o ID é válido
        const validateUUID = validate(id_user);
        if (!validateUUID) {
            throw new Error("Invalid ID.");
        }

        // Busca o User no banco de dados
        const User = await this.userData.getUserById(id_user);

        // Verifica se o User foi encontrado
        if (!User) {
            throw new Error( "User not found.");
        }

        return User;
    };

    addressUpdate = async (id_user: string, address: string) => {

        // Verifica se os campos foram preenchidos
        
        if (!address) {
            throw new Error('"Address" field is required, please fill it out.');
        }
        
        if (address.length < 2 || address.length > 100) {
            throw new Error('The address must be between 2 and 100 characters.');
        }
        
        if (!id_user) {
            throw new Error('The "id_user" field is required, please fill it out.');
        }

        // Verifica se o ID é válido
        const validateUUID = validate(id_user);
        if (!validateUUID) {
            throw new Error('Invalid ID.');
        }

        // Atualiza no banco de dados
        await this.userData.addressUpdate(id_user, address);
    
        // Retorna os dados atualizados
        return { id_user, address };
        
    };


}