import express from "express";
import cors from "cors";
import { ProductRouter } from "./routes/ProductRouter";
import { userRouter }  from "./routes/userRouter";
import { saleRouter } from "./routes/SaleRouter";

export const app = express();

app.use(express.json());
app.use(cors());


app.use("/Produto", ProductRouter);
app.use("/users", userRouter);
app.use("/sale", saleRouter);
