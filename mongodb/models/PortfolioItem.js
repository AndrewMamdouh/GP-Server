import { Schema } from "mongoose";

export const PortfolioItemSchema = new Schema({
  id: { type: Schema.Types.ObjectId, unique: true },
  date: { type: Date },
  owner: { type: Schema.Types.ObjectId, ref: "Freelancer" },
  url: { type: String, required: true },
});
