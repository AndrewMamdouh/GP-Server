import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as Client } from "../mongodb/models/Client.js";
import { httpResponseCodes } from "../constants/errorCodes.js";
import UpdateProfileService from "../services/UpdateProfileService.js";
import { userTypes } from "../constants/models.js";

const { NO_CONTENT, NOT_FOUND, OK } = httpResponseCodes;

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
    const isFreelancer = await Freelancer.findById(req.user.id).exec();
    const isClient = await Client.findById(req.user.id).exec();
    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});
    const userInfo = isClient || isFreelancer;
    const userType = userInfo.userType;
    UpdateProfileService(req.body, userType);
    const newUserInfo = userType === userTypes.FREELANCER ? await Freelancer.updateOne({ _id: req.user.id }, { ...req.body }) : await Client.updateOne({ _id: req.user.id }, { ...req.body });
    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

export { getProfile, updateProfile };
