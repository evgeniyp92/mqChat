import { Schema, model, connect } from "mongoose";

interface IUser {
  name: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
});

export const UserModel = model<IUser>("User", userSchema);
