import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "@/modules/auth/auth.routes";
import walletRoutes from "@/modules/wallets/wallet.routes";
import transactionRoutes from "@/modules/transactions/transaction.routes";
import reportRoutes from "@/modules/reports/report.routes";
import excelRoutes from "@/modules/excel/excel.routes";
import categoryRoutes from "@/modules/categories/category.routes";
import { errorHandler } from "@/middlewares/errorHandler";
import { responseWrapper } from "@/middlewares/responseWrapper";

dotenv.config();

export const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(responseWrapper);

app.get("/", (_req, res) => res.success("SpendBook API"));

app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);
