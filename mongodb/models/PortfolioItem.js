import { Schema, model } from "mongoose";

export const PortfolioItemSchema = new Schema({
  date: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "Freelancer", required: true },
  url: { type: String, required: true },
  features: { type: [Number], required: true }
});

const PortfolioItemModel = model("PortfolioItem", PortfolioItemSchema);

export default PortfolioItemModel;
