import mongoose from 'mongoose';

export const UserInfoSchema = new mongoose.Schema({
   uid:        { type: mongoose.Schema.Types.ObjectId, unique: true },
   username:   { type: String, required: true },
   email:      { type: String, required: true },
   fullName:   { type: String, required: true },
   password:   { type: String, required: true },
});

const UserInfoModel = mongoose.model('UserInfo', UserInfoSchema);

export default UserInfoModel;

//R2ebxGZud75OF4Cb