import mongoose from 'mongoose';

export const PointSchema = new mongoose.Schema({
    type:        { type: String, enum: ['Point'], default: 'Point'},
    coordinates: { type: [Number], required: true }
});