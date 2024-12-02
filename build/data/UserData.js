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
exports.UserData = void 0;
const connection_1 = __importDefault(require("../config/connection"));
class UserData {
    constructor() {
        this.getUserByEmail = (email_user) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, connection_1.default)('customer').where({ email_user }).first();
            return result || null;
        });
        this.createUser = (user) => __awaiter(this, void 0, void 0, function* () {
            yield (0, connection_1.default)('customer').insert(user);
        });
        this.getUserById = (id_user) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, connection_1.default)('customer').where({ id_user }).first();
            return result || null;
        });
        this.addressUpdate = (id_user, address) => __awaiter(this, void 0, void 0, function* () {
            yield (0, connection_1.default)('customer')
                .update({ address })
                .where({ id_user });
        });
    }
}
exports.UserData = UserData;
//# sourceMappingURL=UserData.js.map