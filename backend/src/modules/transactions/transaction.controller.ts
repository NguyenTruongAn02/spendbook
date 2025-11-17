import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import * as service from "@/modules/transactions/transaction.service";

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
        const page = parseInt((req.query.page as string) || "1", 10);
        const limit = parseInt((req.query.limit as string) || "20", 10);
        const result = await service.getHistory(req.userId!, page, limit);
        res.success(result);
    } catch (err) {
        next(err);
    }
}
