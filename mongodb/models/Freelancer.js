import { Schema, model } from "mongoose";
import { UserInfoSchema } from "./UserInfo.js";
import { LocationSchema } from "./Location.js";
import { userTypes, freelancerTypes } from "../../constants/models.js";

const FreelancerSchema = new Schema({
  ...UserInfoSchema.obj,
  userType: {
    type: String,
    enum: Object.values(userTypes),
    default: userTypes.FREELANCER
  },
  freelancerType: {
    type: String,
    enum: Object.values(freelancerTypes),
    required: true
  },
  address: { type: LocationSchema, required: true },
  phoneNum: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  description: { type: String, required: true },
  portfolioItems: [{ type: Schema.Types.ObjectId, ref: "PortfolioItem" }],
  packages: [{ type: Schema.Types.ObjectId, ref: "Package" }],
});

const FreelancerModel = model("Freelancer", FreelancerSchema);

export default FreelancerModel;
