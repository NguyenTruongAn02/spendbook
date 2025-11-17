import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import * as service from "@/modules/reports/report.service";

export async function statement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { walletId, from, to } = req.query;
        if (!walletId || !from || !to) throw new Error("Thiếu tham số");

        const result = await service.getStatement(
            req.userId!,
            walletId as string,
            new Date(from as string),
            new Date(to as string)
        );

        res.success(result);
    } catch (err) {
        next(err);
    }
}
