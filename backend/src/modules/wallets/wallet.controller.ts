import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import * as service from "./wallet.service";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallet = await service.createWallet(req.userId!, req.body);
        res.success(wallet, null, 201);
    } catch (err) { next(err); }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallets = await service.listWallets(req.userId!);
        res.success(wallets);
    } catch (err) { next(err); }
}

export async function summary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const result = await service.getWalletSummary(req.userId!);
        res.success(result);
    } catch (err) { next(err); }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallet = await service.updateWallet(req.userId!, req.params.id, req.body);
        res.success(wallet);
    } catch (err) { next(err); }
}

export async function archive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallet = await service.archiveWallet(req.userId!, req.params.id);
        res.success(wallet);
    } catch (err) { next(err); }
}

export async function restore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallet = await service.restoreWallet(req.userId!, req.params.id);
        res.success(wallet);
    } catch (err) { next(err); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const wallet = await service.deleteWallet(req.userId!, req.params.id);
        res.success(wallet);
    } catch (err) { next(err); }
}
