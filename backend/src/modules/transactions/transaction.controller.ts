import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import * as service from "@/modules/transactions/transaction.service";
import { TransactionType } from "@/modules/transactions/transaction.model";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const tx = await service.createTransaction(req.userId!, req.body);
        res.success(tx, null, 201);
    } catch (err) {
        next(err);
    }
}

export async function history(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { cursor, sort, type } = req.query;

        const limit = parseInt((req.query.limit as string) || "20", 10);

        let sortValue: "newest" | "oldest" = "newest";
        if (sort === "oldest") sortValue = "oldest";

        let typeValue: TransactionType | "ALL" = "ALL";
        if (type === "INCOME" || type === "EXPENSE") {
            typeValue = type;
        }

        const result = await service.getHistory(req.userId!, {
            cursor: cursor as string | undefined,
            limit,
            sort: sortValue,
            type: typeValue,
        });

        res.success(result);
    } catch (err) {
        next(err);
    }
}
