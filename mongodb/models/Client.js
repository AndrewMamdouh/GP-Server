import { Schema, model } from "mongoose";
import { UserSchema } from "./User.js";

const ClientSchema = new Schema({
  ...UserSchema.obj,
  favList: [{ type: Schema.Types.ObjectId, ref: "Freelancer" }],
});

const ClientModel = model("Client", ClientSchema);

export default ClientModel;
