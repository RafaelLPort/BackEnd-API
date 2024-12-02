import express, { Request, Response } from 'express';
import cors from 'cors';
import { v7 as uuidv7, validate } from 'uuid';
import connection from './config/connection';
import { generateId } from './middlewares/idGenerator';
import { Produto } from './types/product';
import { Cliente } from './types/user';
import { ProductRouter } from './routes/ProductRouter';
import { userRouter } from './routes/userRouter';
import { saleRouter } from './routes/SaleRouter';

const app = express();
app.use(express.json());
app.use(ProductRouter);
app.use(userRouter);
app.use(saleRouter);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
