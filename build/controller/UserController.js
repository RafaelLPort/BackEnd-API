"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserBusiness_1 = require("../business/UserBusiness");
const authenticator_1 = require("../middlewares/authenticator");
const connection_1 = __importDefault(require("../config/connection"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    constructor() {
        this.userBusiness = new UserBusiness_1.UserBusiness();
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name_user, password_user, email_user } = req.body;
                const User = yield this.userBusiness.createUser(name_user, password_user, email_user);
                res.status(201).json({ message: 'User criado com sucesso!', User });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || 'Erro ao criar User!';
                res.status(400).json({ error: message });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email_user, password_user } = req.body;
                const user = yield (0, connection_1.default)("customer").where("email_user", email_user).first();
                if (!user) {
                    throw new Error("User not found.");
                }
                const passwordMatch = yield bcryptjs_1.default.compare(password_user, user.password_user);
                if (!passwordMatch) {
                    throw new Error("Invalid password.");
                }
                const authenticator = new authenticator_1.Authenticator();
                const token = authenticator.generateToken({ id: user.id_user });
                res.status(200).json({ message: "Login successful", token });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.getInfoByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_user } = req.params;
                const User = yield this.userBusiness.getUserById(id_user);
                res.status(200).json({ message: 'Informações do User', User });
            }
            catch (error) {
                const message = error.message || 'Erro ao buscar informações do User!';
                res.status(500).json({ message });
            }
        });
        this.addressUpdate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_user } = req.params;
                const { address } = req.body;
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error("Authorization token is required.");
                }
                const authenticator = new authenticator_1.Authenticator();
                const tokenData = authenticator.getTokenData(token);
                if (id_user !== tokenData.id) {
                    throw new Error("You are not authorized to update the address of this user.");
                }
                const newAddress = yield this.userBusiness.addressUpdate(id_user, address);
                res.status(201).json({ message: 'Address successfully updated!', newAddress });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || 'Error updating the address!';
                res.status(400).json({ error: message });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map