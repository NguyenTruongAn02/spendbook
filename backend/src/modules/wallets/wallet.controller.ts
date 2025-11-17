import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import * as service from "@/modules/wallets/wallet.service";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallet = await service.createWallet(req.userId!, req.body);
        res.success(wallet, null, 201);
    } catch (err) {
        next(err);
    }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallets = await service.listWallets(req.userId!);
        res.success(wallets);
    } catch (err) {
        next(err);
    }
}
