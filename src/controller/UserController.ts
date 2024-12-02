import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { Authenticator } from "../middlewares/authenticator";
import connection from '../config/connection';
import bcrypt from "bcryptjs";



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

    login = async (req: Request, res: Response): Promise<void> => {
        try {
          const { email_cliente, senha_cliente } = req.body;
    
          // if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
          //   throw new Error("Invalid email format.");
          // }x
    
          const user = await connection("cliente").where("email_cliente", email_cliente).first();

          console.log("user: ",user);

          if (!user) {
            throw new Error("User not found.");
          }
    
          const passwordMatch = await bcrypt.compare(senha_cliente, user.senha_cliente);
          if (!passwordMatch) {
            throw new Error("Invalid password.");
          }
          
          console.log("id cliente UserController: ",user.id_cliente);

          const authenticator = new Authenticator();
          const token = authenticator.generateToken({ id: user.id_cliente });
          console.log("id cliente UserController: ",token);
    
          res.status(200).json({ message: "Login successful", token });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
    }



    getInfoByClienteId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_cliente } = req.params; // Obtém o id_cliente da URL




            console.log("ProdutoId recebido:", req.params.id_cliente);





            // Chama a função de serviço para buscar o cliente
            const cliente = await this.userBusiness.getClienteById(id_cliente);

            // Retorna as informações do cliente
             res.status(200).json({ message: 'Informações do cliente', cliente });
        } catch (error: any) {
            const message = error.message || 'Erro ao buscar informações do cliente!';
             res.status(500).json({ message });
        }
    }

    addressUpdate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_cliente } = req.params;
            const { address } = req.body;
            const token = req.headers.authorization;



            console.log("id_cliente: ", req.params.id_cliente);
            console.log("adress: ", req.body.address);

            if (!token) {
              throw new Error("Authorization token is required.");
            }

            const authenticator = new Authenticator();
            const tokenData = authenticator.getTokenData(token);

            console.log("token id: ", tokenData.id);
            
            if (id_cliente !== tokenData.id) {
              throw new Error("You are not authorized to delete this user.");
            }

            // Chama a camada de negócios para criar o cliente
            const newAddress = await this.userBusiness.addressUpdate( id_cliente, address );

            res.status(201).json({ message: 'Address successfully updated!', newAddress });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Error updating the address!';
            res.status(400).json({ error: message });
        }
    };

}
