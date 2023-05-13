import { Schema } from "mongoose";

export const UserInfoSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});
