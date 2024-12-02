"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleRouter = void 0;
const express_1 = __importDefault(require("express"));
const SaleController_1 = require("../controller/SaleController");
exports.saleRouter = express_1.default.Router();
const saleController = new SaleController_1.SaleController();
exports.saleRouter.post('/sale', saleController.createReceipt);
exports.saleRouter.get('/sale/:ReceiptId', saleController.getReceiptById);
//# sourceMappingURL=SaleRouter.js.map