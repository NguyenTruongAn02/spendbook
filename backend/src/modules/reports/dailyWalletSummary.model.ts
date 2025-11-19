import { Schema, model, Document, Types } from "mongoose";

export interface IDailyWalletSummary extends Document {
    userId: Types.ObjectId;
    walletId: Types.ObjectId;
    date: Date;
    totalIncome: number;
    totalExpense: number;

    openingBalance?: number;
    closingBalance?: number;
}

const dailyWalletSummarySchema = new Schema<IDailyWalletSummary>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true, index: true },
        date: { type: Date, required: true, index: true },

        totalIncome: { type: Number, required: true, default: 0 },
        totalExpense: { type: Number, required: true, default: 0 },

        openingBalance: { type: Number },
        closingBalance: { type: Number },
    },
    { timestamps: true }
);

dailyWalletSummarySchema.index(
    { userId: 1, walletId: 1, date: 1 },
    { unique: true }
);

export const DailyWalletSummary = model<IDailyWalletSummary>(
    "DailyWalletSummary",
    dailyWalletSummarySchema
);
