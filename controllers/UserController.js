import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as Client } from "../mongodb/models/Client.js";
import { httpResponseCodes } from "../constants/errorCodes.js";

const { OK, NOT_FOUND } = httpResponseCodes;

const getProfile = async (req, res, next) => {
  try {
    if (!req.user) return res;
    const isFreelancer = await Freelancer.findById(req.user.id, {
      __v: false,
      password: false,
    }).exec();
    const isClient = await Client.findById(req.user.id, {
      __v: false,
      password: false,
    }).exec();
    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});
    const userInfo = isClient || isFreelancer;
    return res.status(OK).json(userInfo);
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (!req.user) return res;
    await UserInfo.updateOne(req.user, req.body);
    const newUserInfo = await UserInfo.findOne(req.body);
    return res.status(OK).json(newUserInfo);
  } catch (err) {
    return next(err);
  }
};

export { getProfile, updateProfile };
