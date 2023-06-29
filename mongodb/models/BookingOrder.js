import { Schema } from "mongoose";

export const BookingOrderSchema = new Schema({
  date: { type: Date, default: Date.now },
  sender: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "Freelancer", required: true },
});
