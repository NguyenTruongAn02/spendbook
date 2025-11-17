import { Request, Response, NextFunction } from "express";
import * as authService from "@/modules/auth/auth.service";

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { idToken } = req.body;
        console.log("idToken", idToken);
        if (!idToken) throw new Error("Thiếu idToken");

        const result = await authService.loginWithGoogle(idToken);
        res.success(result)
    } catch (err) {
        next(err);
    }
}
