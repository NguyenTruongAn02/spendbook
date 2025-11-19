import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import * as service from "@/modules/reports/report.service";
import { TransactionType } from "@/modules/transactions/transaction.model";

type StatementSort = "newest" | "oldest";
type StatementTypeFilter = TransactionType | "ALL";

export async function statement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { walletId, from, to, cursor, limit, type, sort } = req.query;

        if (!walletId || !from || !to) {
            throw new Error("Thiếu tham số");
        }

        const rawLimit = (limit as string) || "50";
        let parsedLimit = parseInt(rawLimit, 10);
        if (Number.isNaN(parsedLimit) || parsedLimit <= 0) parsedLimit = 50;
        if (parsedLimit > 200) parsedLimit = 200;

        const rawType = (type as string) || "ALL";
        const typeFilter: StatementTypeFilter =
            rawType === "INCOME" || rawType === "EXPENSE" ? rawType : "ALL";

        const rawSort = (sort as string) || "newest";
        const sortOption: StatementSort = rawSort === "oldest" ? "oldest" : "newest";

        const result = await service.getStatement(
            req.userId!,
            walletId as string,
            new Date(from as string),
            new Date(to as string),
            {
                cursor: cursor ? (cursor as string) : undefined,
                limit: parsedLimit,
                type: typeFilter,
                sort: sortOption,
            }
        );

        res.success(result);
    } catch (err) {
        next(err);
    }
}

export async function chart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { walletId, from, to } = req.query;

        if (!from || !to) {
            throw new Error("Thiếu tham số from/to");
        }

        const result = await service.getChartData(
            req.userId!,
            walletId ? (walletId as string) : undefined,
            new Date(from as string),
            new Date(to as string)
        );

        res.success(result);
    } catch (err) {
        next(err);
    }
}
