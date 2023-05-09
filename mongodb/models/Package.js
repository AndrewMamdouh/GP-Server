import { Schema } from "mongoose";

export const PackageSchema = new Schema({
  //id: { type: Schema.Types.ObjectId, unique: true },
  date: { type: Date },
  owner: { type: Schema.Types.ObjectId, ref: "Freelancer" },
  photosNum: { type: Number, required: true },
  description: { type: String, required: true },
});
