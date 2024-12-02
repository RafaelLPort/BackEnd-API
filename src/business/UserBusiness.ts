import { UserData } from "../data/UserData";
import { generateId } from "../middlewares/idGenerator";
import { Cliente } from "../types/user";
import { validate } from 'uuid';
import bcrypt from "bcryptjs";

export class UserBusiness {
    userData = new UserData();

    createCliente = async (nome_cliente: string, senha_cliente: string, email_cliente: string): Promise<Omit<Cliente, 'senha_cliente'>> => {
        // Verifica se os campos foram preenchidos
        if (!nome_cliente) {
            throw new Error('Campo "Nome" obrigatório, favor a preenchê-lo');
        }

        if (!senha_cliente) {
            throw new Error('Campo "Senha" obrigatório, favor preenchê-lo');
        }

        if (!email_cliente) {
            throw new Error('Campo "E-mail" obrigatório, favor preenchê-lo');
        }

        //LIMITAÇÃO DE CARACTERES NO NOME
        if (nome_cliente.length < 2 || nome_cliente.length > 100) {
            throw new Error('O nome deve ter entre 2 e 100 caracteres.');
        }

        //VERIFICAÇÃO PARA NOME TER SOMENTE LETRAS
        const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (!nomeRegex.test(nome_cliente)) {
            throw new Error('O campo "Nome" deve conter apenas letras.');
        }

        //VERIFICAÇÃO SE NOME CONTEM SOMENTE A TECLA ESPAÇO
        if (!nome_cliente.trim()) {
            throw new Error('O campo "Nome" não pode conter apenas espaços.');
        }

        //VERIFICAÇÃO SE A SENHA TEM SÓ A TECLA ESPAÇO
        if (!senha_cliente.trim()) {
            throw new Error('O campo "Senha" não pode conter apenas espaços.');
        }

        // VERIFICAÇÃO SE O E-MAIL É VÁLIDO
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_cliente)) {
            throw new Error('O campo "E-mail" deve conter um endereço de e-mail válido.');
        }

        // Verifica se o cliente já existe
        const existingCliente = await this.userData.getClienteByEmail(email_cliente);
        if (existingCliente) {
            throw new Error('E-mail já cadastrado.');
        }

        const hashedPassword = await bcrypt.hash(senha_cliente, 10);
        
        // Criação do cliente
        const newUser: Cliente = {
            id_cliente: generateId(),
            nome_cliente,
            email_cliente,
            senha_cliente: hashedPassword
        };

        await this.userData.createCliente(newUser);


        // Retorna os dados do cliente (exceto a senha)
        return newUser;
    };

    getClienteById = async (id_cliente: string): Promise<Cliente | null> => {

        //VERIFICAÇÃO DO ID FORNECIDO
        if (!id_cliente) {
            throw new Error('ID do cliente é obrigatório.');
        }

        // Verifica se o ID é válido
        const validateUUID = validate(id_cliente);
        if (!validateUUID) {
            throw new Error('ID inválido.');
        }

        // Busca o cliente no banco de dados
        const cliente = await this.userData.getClienteById(id_cliente);

        // Verifica se o cliente foi encontrado
        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }

        return cliente;
    };

    addressUpdate = async (id_cliente: string, address: string) => {

        // Verifica se os campos foram preenchidos
        
        if (!address) {
            throw new Error('"Address" field is required, please fill it out.');
        }
        
        if (address.length < 2 || address.length > 100) {
            throw new Error('The address must be between 2 and 100 characters.');
        }
        
        if (!id_cliente) {
            throw new Error('The "id_cliente" field is required, please fill it out.');
        }

        // Verifica se o ID é válido
        const validateUUID = validate(id_cliente);
        if (!validateUUID) {
            throw new Error('Invalid ID.');
        }

        // Atualiza no banco de dados
        await this.userData.addressUpdate(id_cliente, address);
    
        // Retorna os dados atualizados
        return { id_cliente, address };
        
    };


}