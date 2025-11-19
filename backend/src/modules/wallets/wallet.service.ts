import { Wallet } from "@/modules/wallets/wallet.model";
import { Types } from "mongoose";
import { Transaction } from "@/modules/transactions/transaction.model";

export async function createWallet(userId: string, payload: any) {
    const { name, bankName, accountNumber, startDate, openingBalance } = payload;

    return Wallet.create({
        userId: new Types.ObjectId(userId),
        name,
        bankName,
        accountNumber,
        startDate,
        openingBalance,
        currentBalance: openingBalance
    });
}

export async function listWallets(userId: string) {
    const wallets = await Wallet.find({ userId, isArchived: { $ne: true } }).lean();

    const results = await Promise.all(
        wallets.map(async (w) => {
            const count = await Transaction.countDocuments({ walletId: w._id });
            return { ...w, transactionsCount: count };
        })
    );

    return results;
}

export async function getWalletSummary(userId: string) {
    const wallets = await Wallet.find({ userId, isArchived: { $ne: true } }).lean();

    const totalBalance = wallets.reduce((sum, w) => sum + (w.currentBalance || 0), 0);

    return { totalBalance };
}

export async function updateWallet(userId: string, walletId: string, payload: any) {
    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) throw new Error("Không tìm thấy ví");

    const { name, bankName, accountNumber, startDate, openingBalance } = payload;

    if (name !== undefined) wallet.name = name;
    if (bankName !== undefined) wallet.bankName = bankName;
    if (accountNumber !== undefined) wallet.accountNumber = accountNumber;
    if (startDate !== undefined) wallet.startDate = startDate;

    const hasTransaction = await Transaction.exists({ walletId });

    if (hasTransaction && openingBalance !== undefined) {
        wallet.openingBalance = openingBalance;
        wallet.currentBalance = await calculateCurrentBalance(walletId, openingBalance);
    } else if (!hasTransaction && openingBalance !== undefined) {
        wallet.openingBalance = openingBalance;
        wallet.currentBalance = openingBalance;
    }

    await wallet.save();
    return wallet;
}

export async function archiveWallet(userId: string, walletId: string) {
    return Wallet.findOneAndUpdate(
        { _id: walletId, userId, isDeleted: false },
        { isArchived: true },
        { new: true }
    );
}

export async function restoreWallet(userId: string, walletId: string) {
    return Wallet.findOneAndUpdate(
        { _id: walletId, userId },
        { isArchived: false },
        { new: true }
    );
}

export async function deleteWallet(userId: string, walletId: string) {
    return Wallet.findOneAndUpdate(
        { _id: walletId, userId },
        { isDeleted: true, isArchived: true },
        { new: true }
    );
}

export async function calculateCurrentBalance(walletId: string, openingBalance: number) {
    const totalTx = await Transaction.aggregate([
        { $match: { walletId: new Types.ObjectId(walletId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const total = totalTx[0]?.total || 0;
    return openingBalance + total;
}
