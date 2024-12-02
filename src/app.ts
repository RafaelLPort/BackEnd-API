import express from "express";
import cors from "cors";
import { ProductRouter } from "./routes/ProductRouter";
import { userRouter }  from "./routes/userRouter";
import { saleRouter } from "./routes/SaleRouter";

export const app = express();

app.use(express.json());
app.use(cors());

app.use(ProductRouter);
app.use(userRouter);
app.use(saleRouter);
