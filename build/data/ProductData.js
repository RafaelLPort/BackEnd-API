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
exports.ProductData = void 0;
const connection_1 = __importDefault(require("../config/connection"));
class ProductData {
    constructor() {
        this.createProduct = (Product) => __awaiter(this, void 0, void 0, function* () {
            yield (0, connection_1.default)('product').insert(Product);
        });
        this.getAllProducts = (offset, limit) => __awaiter(this, void 0, void 0, function* () {
            const Products = yield (0, connection_1.default)('product')
                .select('*')
                .limit(limit)
                .offset(offset);
            return Products;
        });
        this.getProductById = (id_product) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, connection_1.default)('product').where({ id_product }).first();
            return result || null;
        });
        this.updateProduct = (id_product, name_product, price_product, desc_product, category_product, stock_product) => __awaiter(this, void 0, void 0, function* () {
            const Product = yield (0, connection_1.default)('product').where({ id_product: id_product }).first();
            if (!Product) {
                throw new Error('Product não encontrado.');
            }
            yield (0, connection_1.default)('product')
                .where({ id_product: id_product })
                .update({
                name_product: name_product,
                price_product: price_product,
                desc_product: desc_product,
                category_product: category_product,
                stock_product: stock_product
            });
        });
        this.deleteProductById = (id_product) => __awaiter(this, void 0, void 0, function* () {
            yield (0, connection_1.default)('product').where({ id_product }).delete();
        });
        this.getProductWithFilter = (offset, limit, name_product, category_product, Order) => __awaiter(this, void 0, void 0, function* () {
            let query = (0, connection_1.default)('product');
            if (name_product) {
                query = query.where('name_product', 'ilike', `%${name_product}%`);
            }
            if (category_product) {
                query = query.where('category_product', 'ilike', `%${category_product}%`);
            }
            if (Order) {
                query = query.orderBy('name_product', Order.toLowerCase());
            }
            const Products = yield query
                .select('*')
                .limit(limit)
                .offset(offset);
            return Products;
        });
    }
}
exports.ProductData = ProductData;
//# sourceMappingURL=ProductData.js.map