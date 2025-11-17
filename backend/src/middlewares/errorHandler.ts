import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error("❌ Error:", err);

    const status = err.status || 400;
    const message = err.message || "Server error";
    const code = err.code || "SERVER_ERROR";

    return res.fail(message, status, code);
}
