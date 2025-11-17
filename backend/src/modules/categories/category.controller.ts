import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";
import { Category } from "@/modules/categories/category.model";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { type } = req.query; // INCOME / EXPENSE
        const userId = req.userId!;

        const filter: any = {
            $or: [{ userId: null }, { userId }],
        };
        if (type) filter.type = type;

        const categories = await Category.find(filter).sort({ createdAt: 1 });
        res.success(categories);
    } catch (err) {
        next(err);
    }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId!;
        const { name, type, icon } = req.body;
        const category = await Category.create({ userId, name, type, icon });
        res.success(category, null, 201);
    } catch (err) {
        next(err);
    }
}
