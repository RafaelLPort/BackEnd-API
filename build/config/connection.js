"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const connection = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '123',
        database: 'TrabalhoBackend',
        port: 5432,
    },
});
exports.default = connection;
//# sourceMappingURL=connection.js.map