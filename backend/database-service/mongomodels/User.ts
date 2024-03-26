import { Schema, Document, model, connect } from "mongoose";

interface IUser extends Document {
  username: string;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
});

export const User = model("User", userSchema);
