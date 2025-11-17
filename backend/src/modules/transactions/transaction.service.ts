import { Types } from "mongoose";
import { Wallet } from "@/modules/wallets/wallet.model";
import { Category } from "@/modules/categories/category.model";
import { Transaction } from "@/modules/transactions/transaction.model";

export async function createTransaction(userId: string, payload: any) {
    const { walletId, categoryId, type, amount, date, note } = payload;

    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) throw new Error("Không tìm thấy ví");

    if (type === "EXPENSE" && amount > wallet.currentBalance) {
        throw new Error("Số tiền chi không được lớn hơn số dư ví");
    }

    let categoryName = "Khác";
    let catId: Types.ObjectId | undefined = undefined;

    if (categoryId) {
        const category = await Category.findOne({
            _id: categoryId,
            $or: [{ userId }, { userId: null }],
        });
        if (!category) throw new Error("Danh mục không hợp lệ");
        if (category.type !== type) throw new Error("Loại danh mục không khớp Thu/Chi");

        categoryName = category.name;
        catId = category._id as Types.ObjectId;
    }

    const tx = await Transaction.create({
        userId: new Types.ObjectId(userId),
        walletId: wallet._id,
        categoryId: catId,
        categoryName,
        type,
        amount,
        date,
        note
    });

    if (type === "INCOME") wallet.currentBalance += amount;
    else wallet.currentBalance -= amount;

    await wallet.save();
    return tx;
}

export async function getHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Transaction.find({ userId })
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Transaction.countDocuments({ userId })
    ]);

    return {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}
