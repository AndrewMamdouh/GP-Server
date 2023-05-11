import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import { httpResponseCodes } from "../constants/errorCodes.js";

const { OK, NOT_FOUND } = httpResponseCodes

const getProfile = async (req, res, next) => {
  try {
    if(!req.user) return res;
    const userInfo = await UserInfo.findOne(req.user);
    if (!userInfo) return res.status(NOT_FOUND).json({});
    return res.status(OK).json(userInfo);
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if(!req.user) return res;
    await UserInfo.updateOne(req.user, req.body);
    const newUserInfo = await UserInfo.findOne(req.body);
    return res.status(OK).json(newUserInfo);
  } catch (err) {
    return next(err);
  }
};

export { getProfile, updateProfile };
