import { Schema, model } from "mongoose";
import { LocationSchema } from "./Location.js";
import { PortfolioItemSchema } from "./PortfolioItem.js";
import { PackageSchema } from "./Package.js";

const FreelancerSchema = new Schema({
  userInfo: { type: Schema.Types.ObjectId, ref: "UserInfo" },
  type: {
    type: String,
    enum: ["PHOTOGRAPHER", "GRAPHIC_DESIGNER"],
    default: "PHOTOGRAPHER",
  },
  address: { type: LocationSchema, required: true },
  phoneNum: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  description: { type: String, required: true },
  portfolioItems: [{ type: PortfolioItemSchema }],
  packages: [{ type: PackageSchema }],
});

const FreelancerModel = model("Freelancer", FreelancerSchema);

export default FreelancerModel;
