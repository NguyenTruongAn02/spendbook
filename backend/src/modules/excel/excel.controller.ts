import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import { exportStatementExcel } from "@/modules/excel/excel.service";
import { Buffer } from "buffer";

export async function exportStatement(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { walletId, from, to } = req.query;
        if (!walletId || !from || !to) {
            throw new Error("Thiếu tham số");
        }

        const fromDate = new Date(from as string);
        const toDate = new Date(to as string);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=statement_${walletId}_${Date.now()}.xlsx`
        );

        await exportStatementExcel(
            req.userId!,
            walletId as string,
            fromDate,
            toDate,
            res
        );
        res.end();

    } catch (err) {
        next(err);
    }
}
