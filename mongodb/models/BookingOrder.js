import { Schema } from "mongoose";

export const BookingOrderSchema = new Schema({
  //id: { type: Schema.Types.ObjectId, unique: true },
  date: { type: Date },
  sender: { type: Schema.Types.ObjectId, ref: "Client" },
  receiver: { type: Schema.Types.ObjectId, ref: "Freelancer" },
});
