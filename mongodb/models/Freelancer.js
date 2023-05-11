import { Schema, model } from "mongoose";
import { LocationSchema } from "./Location.js";
import { PortfolioItemSchema } from "./PortfolioItem.js";
import { PackageSchema } from "./Package.js";
import { freelancerType } from "../../constants/freelancer.js";

const FreelancerSchema = new Schema({
  userInfo: { type: Schema.Types.ObjectId, ref: "UserInfo" },
  type: {
    type: String,
    enum: Object.values(freelancerType),
    required: true
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
