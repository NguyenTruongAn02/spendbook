import "express";

declare module "express-serve-static-core" {
    interface Response {
        success: (data?: any, meta?: any, statusCode?: number) => void;
        fail: (
            message: string,
            statusCode?: number,
            code?: string,
            meta?: any
        ) => void;
    }
}
