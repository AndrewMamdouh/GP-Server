import { Schema, model } from "mongoose";

const ClientSchema = new Schema({
  userInfo: { type: Schema.Types.ObjectId, ref: "UserInfo" },
  favList: [{ type: Schema.Types.ObjectId, ref: "Freelancer" }],
});

const ClientModel = model("Client", ClientSchema);

export default ClientModel;
