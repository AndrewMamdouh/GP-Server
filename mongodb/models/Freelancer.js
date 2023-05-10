import { Schema, model } from "mongoose";
import { UserSchema } from "./User.js";
import { LocationSchema } from "./Location.js";
import { BookingOrderSchema } from "./BookingOrder.js";
import { PortfolioItemSchema } from "./PortfolioItem.js";
import { PackageSchema } from "./Package.js";

const FreelancerSchema = new Schema({
  ...UserSchema.obj,
  type: {
    type: String,
    enum: ["PHOTOGRAPHER", "GRAPHIC_DESIGNER"],
    default: "PHOTOGRAPHER",
  },
  location: { type: LocationSchema, required: true },
  phoneNum: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  description: { type: String, required: true },
  bookingOrders: [{ type: BookingOrderSchema }],
  portfolioItems: [{ type: PortfolioItemSchema }],
  packages: [{ type: PackageSchema }],
});

const FreelancerModel = model("Freelancer", FreelancerSchema);

export default FreelancerModel;
