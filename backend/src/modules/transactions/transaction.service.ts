import { Types } from "mongoose";
import { Wallet } from "@/modules/wallets/wallet.model";
import { Category } from "@/modules/categories/category.model";
import { Transaction, TransactionType, ITransaction } from "@/modules/transactions/transaction.model";
import { updateDailySummaryOnTransaction } from "@/modules/reports/report.service";

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

    await updateDailySummaryOnTransaction(
        userId,
        wallet._id as Types.ObjectId,
        type as TransactionType,
        amount,
        tx.date
    );

    return tx;
}


type HistorySort = "newest" | "oldest";
type HistoryTypeFilter = TransactionType | "ALL";

export interface HistoryCursorOptions {
    cursor?: string;              // base64
    limit?: number;               // default 20
    sort?: HistorySort;           // newest | oldest
    type?: HistoryTypeFilter;     // INCOME | EXPENSE | ALL
}

function encodeCursor(date: Date, id: Types.ObjectId): string {
    const payload = { date: date.toISOString(), id: id.toString() };
    return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function decodeCursor(cursor: string): { date: Date; id: Types.ObjectId } | null {
    try {
        const raw = Buffer.from(cursor, "base64").toString("utf8");
        const obj = JSON.parse(raw);
        if (!obj.date || !obj.id) return null;
        return {
            date: new Date(obj.date),
            id: new Types.ObjectId(obj.id),
        };
    } catch {
        return null;
    }
}

export async function getHistory(
    userId: string,
    options: HistoryCursorOptions
) {
    const {
        cursor,
        limit = 20,
        sort = "newest",
        type = "ALL",
    } = options;

    const userObjectId = new Types.ObjectId(userId);

    const query: any = {
        userId: userObjectId,
    };

    if (type === "INCOME" || type === "EXPENSE") {
        query.type = type;
    }

    let sortSpec: any;
    let cursorCond: any = {};

    if (sort === "newest") {
        sortSpec = { date: -1, _id: -1 };

        if (cursor) {
            const decoded = decodeCursor(cursor);
            if (decoded) {
                const { date, id } = decoded;
                cursorCond = {
                    $or: [
                        { date: { $lt: date } },
                        { date, _id: { $lt: id } },
                    ],
                };
            }
        }
    } else {
        sortSpec = { date: 1, _id: 1 };

        if (cursor) {
            const decoded = decodeCursor(cursor);
            if (decoded) {
                const { date, id } = decoded;
                cursorCond = {
                    $or: [
                        { date: { $gt: date } },
                        { date, _id: { $gt: id } },
                    ],
                };
            }
        }
    }

    const finalQuery = cursorCond.$or
        ? { $and: [query, cursorCond] }
        : query;

    const items: ITransaction[] = await Transaction.find(finalQuery)
        .sort(sortSpec)
        .limit(limit);

    let nextCursor: string | null = null;
    if (items.length === limit) {
        const last = items[items.length - 1];
        nextCursor = encodeCursor(last.date, last._id as Types.ObjectId);
    }

    return {
        items,
        limit,
        sort,
        type,
        nextCursor,
        hasMore: !!nextCursor,
    };
}
