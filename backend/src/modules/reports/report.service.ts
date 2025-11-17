import { Transaction } from "@/modules/transactions/transaction.model";
import { Wallet } from "@/modules/wallets/wallet.model";
import { Types } from "mongoose";

export async function getStatement(
    userId: string,
    walletId: string,
    from: Date,
    to: Date
) {
    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) throw new Error("Không tìm thấy ví");

    const wId = new Types.ObjectId(walletId);

    // giao dịch trước kỳ
    const aggBefore = await Transaction.aggregate([
        { $match: { userId: wallet.userId, walletId: wId, date: { $lt: from } } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    let incomeBefore = 0, expenseBefore = 0;
    aggBefore.forEach((r: any) => {
        if (r._id === "INCOME") incomeBefore = r.total;
        if (r._id === "EXPENSE") expenseBefore = r.total;
    });

    const opening = wallet.openingBalance + incomeBefore - expenseBefore;

    const txInRange = await Transaction.find({
        userId,
        walletId,
        date: { $gte: from, $lte: to }
    }).sort({ date: 1 });

    let totalIncome = 0, totalExpense = 0;
    txInRange.forEach(tx => {
        if (tx.type === "INCOME") totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    const closing = opening + totalIncome - totalExpense;

    return {
        wallet,
        openingBalance: opening,
        totalIncome,
        totalExpense,
        closingBalance: closing,
        transactions: txInRange
    };
}
