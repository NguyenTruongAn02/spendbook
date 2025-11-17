import { Schema, model, Document, Types } from "mongoose";

export interface IWallet extends Document {
    userId: Types.ObjectId;
    name: string;
    bankName?: string;
    accountNumber?: string;
    startDate: Date;
    openingBalance: number;
    currentBalance: number;
}

const walletSchema = new Schema<IWallet>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true },
        bankName: String,
        accountNumber: String,
        startDate: { type: Date, required: true },
        openingBalance: { type: Number, required: true, min: 0 },
        currentBalance: { type: Number, required: true, min: 0 }
    },
    { timestamps: true }
);

walletSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Wallet = model<IWallet>("Wallet", walletSchema);
