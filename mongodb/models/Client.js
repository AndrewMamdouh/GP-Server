import { Schema, model } from "mongoose";
import { UserSchema } from "./User.js";

const ClientSchema = new Schema({
  ...UserSchema.obj,
  joinDate: { type: Date },
  favList: [{ type: Schema.Types.ObjectId, ref: "Freelancer" }],
  suspensionState: { type: Boolean, default: false },
});

const ClientModel = model("Client", ClientSchema);

export default ClientModel;
