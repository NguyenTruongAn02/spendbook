import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
    userId: Types.ObjectId | null;        
    name: string;
    type: "INCOME" | "EXPENSE";
    icon?: string;
}

const categorySchema = new Schema<ICategory>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
        name: { type: String, required: true },
        type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
        icon: { type: String, default: "" }
    },
    { timestamps: true }
);

categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

export const Category = model<ICategory>("Category", categorySchema);
