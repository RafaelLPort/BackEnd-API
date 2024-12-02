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
exports.ProductBusiness = void 0;
const ProductData_1 = require("../data/ProductData");
const idGenerator_1 = require("../middlewares/idGenerator");
const uuid_1 = require("uuid");
class ProductBusiness {
    constructor() {
        this.ProductData = new ProductData_1.ProductData();
        this.createProduct = (name_product, desc_product, price_product, category_product, stock_product) => __awaiter(this, void 0, void 0, function* () {
            if (!name_product ||
                !desc_product ||
                !price_product ||
                !category_product ||
                !stock_product) {
                throw new Error("Fill in all the fields.");
            }
            if (name_product.length < 2 || name_product.length > 100) {
                throw new Error("The product name must be between 2 and 100 characters.");
            }
            if (typeof price_product !== "number" ||
                typeof stock_product !== "number") {
                throw new Error("price_product and stock_product must be numbers.");
            }
            if (!name_product.trim()) {
                throw new Error('The "name_product" field cannot contain only spaces.');
            }
            if (!category_product.trim()) {
                throw new Error('The "category_product" field must contain only letters.');
            }
            if (!desc_product.trim()) {
                throw new Error("The 'desc_product' field cannot contain only spaces.");
            }
            const categoriaRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
            if (!categoriaRegex.test(category_product)) {
                throw new Error('The "category_product" field must contain only letters.');
            }
            if (price_product < 0) {
                throw new Error('The "price_product" field cannot be negative.');
            }
            if (!Number.isInteger(stock_product) || stock_product < 0) {
                throw new Error('The "stock_product" field must be a non-negative integer.');
            }
            const newProduct = {
                id_product: (0, idGenerator_1.generateId)(),
                name_product,
                desc_product,
                price_product,
                category_product,
                stock_product,
            };
            yield this.ProductData.createProduct(newProduct);
        });
        this.getAllProducts = (numPage, itemsPerPage) => __awaiter(this, void 0, void 0, function* () {
            const offset = (numPage - 1) * itemsPerPage;
            const Products = yield this.ProductData.getAllProducts(offset, itemsPerPage);
            return Products;
        });
        this.getProductById = (productId) => __awaiter(this, void 0, void 0, function* () {
            console.log(productId);
            if (!productId) {
                throw new Error("Product ID is required.");
            }
            const validateUUID = (0, uuid_1.validate)(productId);
            if (!validateUUID) {
                throw new Error("Invalid ID.");
            }
            const Product = yield this.ProductData.getProductById(productId);
            if (!Product) {
                throw new Error(" Product not found. ");
            }
            return Product;
        });
        this.updateProduct = (id_product, name_product, price_product, desc_product, category_product, stock_product) => __awaiter(this, void 0, void 0, function* () {
            if (!id_product) {
                throw new Error("Fill in the product ID.");
            }
            const validateUUID = (0, uuid_1.validate)(id_product);
            if (!validateUUID) {
                throw new Error("ID not found, please enter a valid ID.");
            }
            if (name_product && name_product.trim().length === 0) {
                throw new Error("The name_product field cannot contain only spaces.");
            }
            if (desc_product && desc_product.trim().length === 0) {
                throw new Error("The desc_product field cannot contain only spaces.");
            }
            if (category_product && category_product.trim().length === 0) {
                throw new Error("The category_product field cannot contain only spaces.");
            }
            if (price_product &&
                (typeof price_product !== "number" || price_product < 0)) {
                throw new Error("The price field must be a number greater than or equal to zero.");
            }
            if (stock_product &&
                (!Number.isInteger(stock_product) || stock_product < 0)) {
                throw new Error("The stock_product field must be an integer greater than or equal to zero.");
            }
            if (!name_product && price_product && stock_product === undefined) {
                throw new Error("Please provide at least one field to update.");
            }
            const productVerification = yield this.ProductData.getProductById(id_product);
            if (!productVerification) {
                throw new Error("Product not found.");
            }
            yield this.ProductData.updateProduct(id_product, name_product, price_product, desc_product, category_product, stock_product);
        });
        this.getProductWithFilter = (name_product, category_product, Order, numPage, itemsPerPage) => __awaiter(this, void 0, void 0, function* () {
            if (!name_product && !category_product && !Order) {
                throw new Error("You must provide at least the product name, category, or order.");
            }
            if (name_product && name_product.trim().length === 0) {
                throw new Error("The name_product field cannot contain only spaces.");
            }
            if (category_product && category_product.trim().length === 0) {
                throw new Error("The category_product field cannot contain only spaces.");
            }
            if (Order && Order.trim().length === 0) {
                throw new Error("The order field cannot contain only spaces.");
            }
            const offset = (numPage - 1) * itemsPerPage;
            const Product = yield this.ProductData.getProductWithFilter(offset, itemsPerPage, name_product, category_product, Order);
            if (!Product) {
                throw new Error("Product not found.");
            }
            return Product;
        });
        this.deleteProductById = (id_product) => __awaiter(this, void 0, void 0, function* () {
            if (!id_product) {
                throw new Error("Product ID is required.");
            }
            const validateUUID = (0, uuid_1.validate)(id_product);
            if (!validateUUID) {
                throw new Error("Invalid ID.");
            }
            yield this.ProductData.deleteProductById(id_product);
        });
    }
}
exports.ProductBusiness = ProductBusiness;
//# sourceMappingURL=ProductBusiness.js.map