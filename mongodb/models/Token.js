import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  //expireAt: { type: Date, default: Date.now }
});

const TokenModel = model("Token", TokenSchema);

export default TokenModel;