import { Schema, model, Document, Types } from "mongoose";

export type TransactionType = "INCOME" | "EXPENSE";

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    walletId: Types.ObjectId;
    categoryId?: Types.ObjectId;
    categoryName: string;
    type: TransactionType;
    amount: number;
    date: Date;
    note?: string;
}

const transactionSchema = new Schema<ITransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true, index: true },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
        categoryName: { type: String, required: true },
        type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
        amount: { type: Number, required: true, min: 0 },
        date: { type: Date, required: true, index: true },
        note: String
    },
    { timestamps: true }
);

transactionSchema.index({ userId: 1, walletId: 1, date: -1 });

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
