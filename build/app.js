"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ProductRouter_1 = require("./routes/ProductRouter");
const userRouter_1 = require("./routes/userRouter");
const SaleRouter_1 = require("./routes/SaleRouter");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use(ProductRouter_1.ProductRouter);
exports.app.use(userRouter_1.userRouter);
exports.app.use(SaleRouter_1.saleRouter);
//# sourceMappingURL=app.js.map