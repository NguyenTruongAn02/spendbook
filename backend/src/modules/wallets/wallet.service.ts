import { Wallet } from "@/modules/wallets/wallet.model";
import { Types } from "mongoose";

export async function createWallet(userId: string, payload: any) {
    const { name, bankName, accountNumber, startDate, openingBalance } = payload;

    const wallet = await Wallet.create({
        userId: new Types.ObjectId(userId),
        name,
        bankName,
        accountNumber,
        startDate,
        openingBalance,
        currentBalance: openingBalance
    });

    return wallet;
}

export async function listWallets(userId: string) {
    return Wallet.find({ userId }).sort({ createdAt: 1 });
}
