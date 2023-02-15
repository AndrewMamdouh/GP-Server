import mongoose from 'mongoose';

export const BookingOrderSchema = new mongoose.Schema({
    id:       { type: mongoose.Schema.Types.ObjectId, unique: true },
    date:     { type: Date },
    sender:   { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' } 
});