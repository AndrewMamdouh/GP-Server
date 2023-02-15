import mongoose from 'mongoose';
import { UserSchema } from './User.js';

const ClientSchema = new mongoose.Schema({
   ...UserSchema.obj,
   joinDate:        { type: Date },
   favList:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' }],
   suspensionState: { type: Boolean, default: false } 
});

const ClientModel = mongoose.model('Client', ClientSchema);

export default ClientModel;