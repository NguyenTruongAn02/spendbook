import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import { exportStatementExcel } from "@/modules/excel/excel.service";

export async function exportStatement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { walletId, from, to } = req.query;
        if (!walletId || !from || !to) throw new Error("Thiếu tham số");

        const buffer = await exportStatementExcel(
            req.userId!,
            walletId as string,
            new Date(from as string),
            new Date(to as string)
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=statement.xlsx");
        res.success(buffer);
    } catch (err) {
        next(err);
    }
}
