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
exports.ProductController = void 0;
const ProductBusiness_1 = require("../business/ProductBusiness");
class ProductController {
    constructor() {
        this.ProductBusiness = new ProductBusiness_1.ProductBusiness();
        this.createProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name_product, desc_product, price_product, category_product, stock_product } = req.body;
                const Product = yield this.ProductBusiness.createProduct(name_product, desc_product, price_product, category_product, stock_product);
                res.status(201).json({ message: "Product added successfully.", Product });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || "Error adding product!";
                res.status(400).json({ error: message });
            }
        });
        this.getAllProdutcs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page } = req.query;
                const numPage = parseInt(page);
                if (isNaN(numPage) || numPage <= 0) {
                    res.status(400).json({ message: "The 'page' parameter must be a valid number greater than zero." });
                }
                const itemsPerPage = 10;
                const Products = yield this.ProductBusiness.getAllProducts(numPage, itemsPerPage);
                if (Products.length === 0) {
                    res.status(404).json({ message: "No product found." });
                    return;
                }
                res.status(200).json({ message: "Products found.", Products });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || "Error fetching the products!";
                res.status(400).json({ error: message });
            }
        });
        this.getProductById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const Product = yield this.ProductBusiness.getProductById(productId);
                if (!Product) {
                    res.status(404).json({ message: 'Product not found.' });
                    return;
                }
                res.status(200).json({ message: 'Product found.', Product });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || 'Error fetching product!';
                res.status(400).json({ error: message });
            }
        });
        this.updateProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const { name_product, price_product, stock_product, desc_product, category_product } = req.body;
                const Product = yield this.ProductBusiness.updateProduct(productId, name_product, price_product, desc_product, category_product, stock_product);
                res.status(200).json({ message: 'Product updated successfully.', Product });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || 'Error updating product!';
                res.status(400).json({ error: message });
            }
        });
        this.getProductWithFilter = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name_product, category_product, Order, page } = req.query;
                const OrderProduct = Order;
                const nomeProduct = name_product;
                const categoriaProduct = category_product;
                const numPage = parseInt(page);
                if (isNaN(numPage) || numPage <= 0) {
                    res.status(400).json({ message: "The 'page' parameter must be a valid number greater than zero." });
                }
                const itemsPerPage = 10;
                const Product = yield this.ProductBusiness.getProductWithFilter(nomeProduct, categoriaProduct, OrderProduct, numPage, itemsPerPage);
                if (!Product) {
                    res.status(404).json({ message: 'Product not found.' });
                    return;
                }
                res.status(200).json({ message: 'Product found.', Product });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || 'Error fetching product!';
                res.status(400).json({ error: message });
            }
        });
        this.deleteProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                yield this.ProductBusiness.deleteProductById(productId);
                res.status(200).json({ message: 'Product deleted successfully.' });
            }
            catch (error) {
                const message = error.sqlMessage || error.message || 'Error deleting product!';
                res.status(400).json({ error: message });
            }
        });
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map