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
exports.UserBusiness = void 0;
const UserData_1 = require("../data/UserData");
const idGenerator_1 = require("../middlewares/idGenerator");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserBusiness {
    constructor() {
        this.userData = new UserData_1.UserData();
        this.createUser = (name_user, password_user, email_user) => __awaiter(this, void 0, void 0, function* () {
            if (!name_user) {
                throw new Error('Campo "Nome" obrigatório, favor a preenchê-lo');
            }
            if (!password_user) {
                throw new Error('Campo "Senha" obrigatório, favor preenchê-lo');
            }
            if (!email_user) {
                throw new Error('Campo "E-mail" obrigatório, favor preenchê-lo');
            }
            if (name_user.length < 2 || name_user.length > 100) {
                throw new Error('O nome deve ter entre 2 e 100 caracteres.');
            }
            const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
            if (!nomeRegex.test(name_user)) {
                throw new Error('O campo "Nome" deve conter apenas letras.');
            }
            if (!name_user.trim()) {
                throw new Error('O campo "Nome" não pode conter apenas espaços.');
            }
            if (!password_user.trim()) {
                throw new Error('O campo "Senha" não pode conter apenas espaços.');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email_user)) {
                throw new Error('O campo "E-mail" deve conter um endereço de e-mail válido.');
            }
            const existingUser = yield this.userData.getUserByEmail(email_user);
            if (existingUser) {
                throw new Error('E-mail já cadastrado.');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password_user, 10);
            const newUser = {
                id_user: (0, idGenerator_1.generateId)(),
                name_user,
                email_user,
                password_user: hashedPassword
            };
            yield this.userData.createUser(newUser);
            return newUser;
        });
        this.getUserById = (id_user) => __awaiter(this, void 0, void 0, function* () {
            if (!id_user) {
                throw new Error('ID do User é obrigatório.');
            }
            const validateUUID = (0, uuid_1.validate)(id_user);
            if (!validateUUID) {
                throw new Error('ID inválido.');
            }
            const User = yield this.userData.getUserById(id_user);
            if (!User) {
                throw new Error('User não encontrado.');
            }
            return User;
        });
        this.addressUpdate = (id_user, address) => __awaiter(this, void 0, void 0, function* () {
            if (!address) {
                throw new Error('"Address" field is required, please fill it out.');
            }
            if (address.length < 2 || address.length > 100) {
                throw new Error('The address must be between 2 and 100 characters.');
            }
            if (!id_user) {
                throw new Error('The "id_user" field is required, please fill it out.');
            }
            const validateUUID = (0, uuid_1.validate)(id_user);
            if (!validateUUID) {
                throw new Error('Invalid ID.');
            }
            yield this.userData.addressUpdate(id_user, address);
            return { id_user, address };
        });
    }
}
exports.UserBusiness = UserBusiness;
//# sourceMappingURL=UserBusiness.js.map