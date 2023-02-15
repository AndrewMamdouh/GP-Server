import mongoose from 'mongoose';
import { UserInfoSchema } from './UserInfo.js';

export const UserSchema = new mongoose.Schema({
   userInfo:   { type: UserInfoSchema, required: true }
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;