import { Schema } from "mongoose";

export const PackageSchema = new Schema({
  date: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "Freelancer" },
  photosNum: { type: Number, required: true },
  description: { type: String, required: true },
});
