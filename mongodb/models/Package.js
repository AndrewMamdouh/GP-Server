import mongoose from 'mongoose';

export const PackageSchema = new mongoose.Schema({
    id:          { type: mongoose.Schema.Types.ObjectId, unique: true },
    date:        { type: Date },
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
    photosNum:   { type: Number, required: true },
    description: { type: String, required: true }
});