import { Schema } from "mongoose";

export const PortfolioItemSchema = new Schema({
  date: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "Freelancer" },
  url: { type: String, required: true },
});

const PortfolioItemModel = model("PortfolioItem", PortfolioItemSchema);

export default PortfolioItemModel;
