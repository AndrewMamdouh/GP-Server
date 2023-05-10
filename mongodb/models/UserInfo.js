import { Schema, model } from "mongoose";

export const UserInfoSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
});

const UserInfoModel = model("UserInfo", UserInfoSchema);

export default UserInfoModel;
