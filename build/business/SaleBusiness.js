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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleBusiness = void 0;
const SaleData_1 = require("../data/SaleData");
const idGenerator_1 = require("../middlewares/idGenerator");
const uuid_1 = require("uuid");
class SaleBusiness {
    constructor() {
        this.SaleData = new SaleData_1.SaleData();
        this.getReceiptById = (ReceiptId) => __awaiter(this, void 0, void 0, function* () {
            if (!ReceiptId) {
                throw new Error('ID do Receipt é obrigatório.');
            }
            const validateUUID = (0, uuid_1.validate)(ReceiptId);
            if (!validateUUID) {
                throw new Error('ID inválido.');
            }
            const Receipt = yield this.SaleData.getReceiptById(ReceiptId);
            if (!Receipt) {
                throw new Error('Receipt não encontrado.');
            }
            return Receipt;
        });
        this.createReceipt = (id_product, id_user, total_price) => __awaiter(this, void 0, void 0, function* () {
            if (!id_product ||
                !id_user ||
                !total_price) {
                throw new Error("Please fill out all fields.");
            }
            if (typeof total_price !== "number") {
                throw new Error("The total_price must be a number.");
            }
            if (!id_product.trim()) {
                throw new Error("The total_price must be a valid number.");
            }
            if (!id_user.trim()) {
                throw new Error("The field 'id_user' cannot contain only spaces.");
            }
            if (total_price < 0) {
                throw new Error('The "total_price" field cannot be negative.');
            }
            const validateUser = (0, uuid_1.validate)(id_user);
            if (!validateUser) {
                throw new Error("Invalid ID.");
            }
            const user = yield this.SaleData.getUserById(id_user);
            if (!user) {
                throw new Error('User not found.');
            }
            const validateProduct = (0, uuid_1.validate)(id_product);
            if (!validateProduct) {
                throw new Error('Invalid ID.');
            }
            const Product = yield this.SaleData.getProductById(id_product);
            if (!Product) {
                throw new Error('Product not found.');
            }
            yield this.SaleData.createReceipt({
                id_receipt: (0, idGenerator_1.generateId)(),
                id_product,
                id_user,
                total_price
            });
        });
    }
}
exports.SaleBusiness = SaleBusiness;
//# sourceMappingURL=SaleBusiness.js.map