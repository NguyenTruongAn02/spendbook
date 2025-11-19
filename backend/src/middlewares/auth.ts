import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return (res as any).fail("Unauthorized", 401, "UNAUTHORIZED");
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = payload.userId;
        next();
    } catch (e) {
        return (res as any).fail("Invalid token", 401, "INVALID_TOKEN");
    }
}
