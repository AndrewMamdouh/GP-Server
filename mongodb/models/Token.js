import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: "UserInfo" },
  token: { type: String, required: true },
});

const TokenModel = model("Token", TokenSchema);

export default TokenModel;