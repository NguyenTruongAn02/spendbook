import { Request, Response, NextFunction } from "express";

export function responseWrapper(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    res.success = (data?: any, meta?: any, statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            data,
            meta: meta || null,
        });
    };

    res.fail = (
        message: string,
        statusCode = 400,
        code = "BAD_REQUEST",
        meta?: any
    ) => {
        res.status(statusCode).json({
            success: false,
            error: {
                message,
                code,
            },
            meta: meta || null,
        });
    };

    next();
}
