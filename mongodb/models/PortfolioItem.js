import mongoose from 'mongoose';

export const PortfolioItemSchema = new mongoose.Schema({
    id:    { type: mongoose.Schema.Types.ObjectId, unique: true },
    date:  { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
    url:   { type: String, required: true }
});