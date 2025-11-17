import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId: string;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        avatarUrl: String,
        googleId: { type: String, required: true, unique: true }
    },
    { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
