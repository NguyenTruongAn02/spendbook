import { Transaction, TransactionType } from "@/modules/transactions/transaction.model";
import { Wallet } from "@/modules/wallets/wallet.model";
import { Types } from "mongoose";
import { DailyWalletSummary } from "@/modules/reports/dailyWalletSummary.model";

export type StatementSort = "newest" | "oldest";
export type StatementTypeFilter = TransactionType | "ALL";

export interface StatementOptions {
    cursor?: string;
    limit: number;
    type: StatementTypeFilter;
    sort: StatementSort;
}

export async function getStatement(
    userId: string,
    walletId: string,
    from: Date,
    to: Date,
    options: StatementOptions
) {
    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) throw new Error("Không tìm thấy ví");

    const userObjectId = new Types.ObjectId(userId);
    const wId = new Types.ObjectId(walletId);

    const aggBefore = await Transaction.aggregate([
        { $match: { userId: userObjectId, walletId: wId, date: { $lt: from } } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    let incomeBefore = 0, expenseBefore = 0;
    aggBefore.forEach((r: any) => {
        if (r._id === "INCOME") incomeBefore = r.total;
        if (r._id === "EXPENSE") expenseBefore = r.total;
    });

    const opening = wallet.openingBalance + incomeBefore - expenseBefore;

    const aggRange = await Transaction.aggregate([
        {
            $match: {
                userId: userObjectId,
                walletId: wId,
                date: { $gte: from, $lte: to },
            },
        },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" },
            },
        },
    ]);

    let totalIncome = 0, totalExpense = 0;
    aggRange.forEach((r: any) => {
        if (r._id === "INCOME") totalIncome = r.total;
        if (r._id === "EXPENSE") totalExpense = r.total;
    });

    const closing = opening + totalIncome - totalExpense;

    const baseMatch: any = {
        userId: userObjectId,
        walletId: wId,
    };

    const rangeCond = { $gte: from, $lte: to };

    if (!options.cursor) {
        baseMatch.date = rangeCond;
    } else {
        const [cursorDateIso, cursorIdStr] = options.cursor.split("_");
        if (cursorDateIso && cursorIdStr) {
            const cursorDate = new Date(cursorDateIso);
            const cursorId = new Types.ObjectId(cursorIdStr);

            const cmp = options.sort === "newest" ? "$lt" : "$gt";

            baseMatch.$and = [
                { date: rangeCond },
                {
                    $or: [
                        { date: { [cmp]: cursorDate } },
                        {
                            date: cursorDate,
                            _id: { [cmp]: cursorId },
                        },
                    ],
                },
            ];
        } else {
            baseMatch.date = rangeCond;
        }
    }

    if (options.type !== "ALL") {
        baseMatch.type = options.type;
    }

    const sortDoc =
        options.sort === "newest"
            ? { date: -1 as const, _id: -1 as const }
            : { date: 1 as const, _id: 1 as const };

    const docs = await Transaction.find(baseMatch)
        .sort(sortDoc)
        .limit(options.limit + 1); 

    const hasMore = docs.length > options.limit;
    const sliced = hasMore ? docs.slice(0, options.limit) : docs;

    let nextCursor: string | null = null;
    if (hasMore && sliced.length > 0) {
        const last = sliced[sliced.length - 1];
        const lastId = (last._id as Types.ObjectId).toString();
        nextCursor = `${last.date.toISOString()}_${lastId}`;
    }

    return {
        wallet,
        openingBalance: opening,
        totalIncome,
        totalExpense,
        closingBalance: closing,
        transactions: sliced,       
        cursor: options.cursor || null,
        nextCursor,
        hasMore,
        limit: options.limit,
        sort: options.sort,
        type: options.type,
    };
}

export async function getChartData(
    userId: string,
    walletId: string | undefined,
    from: Date,
    to: Date
) {
    const userObjectId = new Types.ObjectId(userId);

    const match: any = {
        userId: userObjectId,
        date: { $gte: from, $lte: to },
    };

    if (walletId) {
        match.walletId = new Types.ObjectId(walletId);
    }

    const daily = await DailyWalletSummary.aggregate([
        { $match: match },
        {
            $project: {
                _id: 0,
                date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                income: "$totalIncome",
                expense: "$totalExpense",
            },
        },
        { $sort: { date: 1 } },
    ]);

    const result: {
        date: string;
        type: "INCOME" | "EXPENSE";
        total: number;
    }[] = [];

    daily.forEach((row: any) => {
        if (row.income && row.income > 0) {
            result.push({
                date: row.date,
                type: "INCOME",
                total: row.income,
            });
        }
        if (row.expense && row.expense > 0) {
            result.push({
                date: row.date,
                type: "EXPENSE",
                total: row.expense,
            });
        }
    });

    return result;
}

export async function updateDailySummaryOnTransaction(
    userId: string,
    walletId: Types.ObjectId,
    type: TransactionType,
    amount: number,
    txDate: Date
) {
    const normalized = new Date(txDate);
    normalized.setUTCHours(0, 0, 0, 0);

    const userObjectId = new Types.ObjectId(userId);

    const filter = {
        userId: userObjectId,
        walletId: walletId,
        date: normalized,
    };

    const inc: any = {};

    if (type === "INCOME") {
        inc.totalIncome = amount;
    } else {
        inc.totalExpense = amount;
    }

    await DailyWalletSummary.findOneAndUpdate(
        filter,
        { $inc: inc },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );
}
