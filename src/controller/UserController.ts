import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { Authenticator } from "../middlewares/authenticator";
import connection from '../config/connection';
import bcrypt from "bcryptjs";



export class UserController {
    userBusiness = new UserBusiness();

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name_user, password_user, email_user } = req.body;

            // Chama a camada de negócios para criar o User
            const User = await this.userBusiness.createUser(name_user, password_user, email_user);

            res.status(201).json({ message: "User created successfully!", User });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || "Error creating user!";
            res.status(400).json({ error: message });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
          const { email_user, password_user } = req.body;
    
          // if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
          //   throw new Error("Invalid email format.");
          // }x
    
          const user = await connection("customer").where("email_user", email_user).first();

          if (!user) {
            throw new Error("User not found.");
          }
    
          const passwordMatch = await bcrypt.compare(password_user, user.password_user);
          if (!passwordMatch) {
            throw new Error("Invalid password.");
          }

          const authenticator = new Authenticator();
          const token = authenticator.generateToken({ id: user.id_user });
    
          res.status(200).json({ message: "Login successful", token });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
    }



    getInfoByUserId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_user } = req.params; // Obtém o id_user da URL

            // Chama a função de serviço para buscar o User
            const User = await this.userBusiness.getUserById(id_user);

            // Retorna as informações do User
             res.status(200).json({ message: '"User information"', User });
        } catch (error: any) {
            const message = error.message || "Error retrieving user information!";
             res.status(500).json({ message });
        }
    }

    addressUpdate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_user } = req.params;
            const { address } = req.body;
            const token = req.headers.authorization;

            if (!token) {
              throw new Error("Authorization token is required.");
            }

            const authenticator = new Authenticator();
            const tokenData = authenticator.getTokenData(token);
            
            if (id_user !== tokenData.id) {
              throw new Error("You are not authorized to update the address of this user.");
            }

            // Chama a camada de negócios para criar o User
            const newAddress = await this.userBusiness.addressUpdate( id_user, address );

            res.status(201).json({ message: 'Address successfully updated!', newAddress });
        } catch (error: any) {
            const message = error.sqlMessage || error.message || 'Error updating the address!';
            res.status(400).json({ error: message });
        }
    };

}
