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
exports.SaleController = void 0;
const SaleBusiness_1 = require("../business/SaleBusiness");
class SaleController {
    constructor() {
        this.saleBusiness = new SaleBusiness_1.SaleBusiness();
        this.getReceiptById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { ReceiptId } = req.params;
                const Receipt = yield this.saleBusiness.getReceiptById(ReceiptId);
                if (!Receipt) {
                    res.status(404).json({ message: 'Receipt Not Found' });
                    return;
                }
                res.status(200).json({ message: 'Receipt Found', Receipt });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || 'Error finding product!';
                res.status(400).json({ error: message });
            }
        });
        this.createReceipt = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_product, id_user, total_price } = req.body;
                const Receipt = yield this.saleBusiness.createReceipt(id_product, id_user, total_price);
                res.status(201).json({ message: "Receipt successfully added.", Receipt });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || "Error adding receipt!";
                res.status(400).json({ error: message });
            }
        });
    }
}
exports.SaleController = SaleController;
//# sourceMappingURL=SaleController.js.map