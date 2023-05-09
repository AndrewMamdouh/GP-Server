import { Schema, model } from "mongoose";

export const UserInfoSchema = new Schema({
  //uid: { type: Schema.Types.ObjectId, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
});

const UserInfoModel = model("UserInfo", UserInfoSchema);

export default UserInfoModel;
