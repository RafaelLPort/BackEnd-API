"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../controller/ProductController");
exports.ProductRouter = express_1.default.Router();
const productController = new ProductController_1.ProductController();
exports.ProductRouter.post('/product', productController.createProduct);
exports.ProductRouter.get('/product/', productController.getAllProdutcs);
exports.ProductRouter.get('/productwithfilter/', productController.getProductWithFilter);
exports.ProductRouter.get('/product/:productId', productController.getProductById);
exports.ProductRouter.delete('/product/:productId', productController.deleteProduct);
exports.ProductRouter.patch('/product/:productId', productController.updateProduct);
//# sourceMappingURL=ProductRouter.js.map