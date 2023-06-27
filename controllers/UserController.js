import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as Client } from "../mongodb/models/Client.js";
import { hashSync, compareSync } from "bcrypt";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import UpdateProfileService from "../services/UpdateProfileService.js";
import { userTypes } from "../constants/models.js";
import { verifyToken } from "../utils/jwt.js";
import AppError from "../constants/AppError.js";
import { tokenTypes } from "../constants/jwt.js";
import SendVerificationEmail from "../services/SendVerificationEmail.js";
import SendResetPasswordEmail from "../services/SendResetPasswordEmail.js";
import userDataValidator from "../utils/userDataValidator.js";
import { userData } from "../constants/userData.js";

const { EMAIL, PASSWORD } = userData;
const { NO_CONTENT, NOT_FOUND, OK } = httpResponseCodes;
const { INVALID_AUTH, EMAIL_VERIFIED, EMAIL_NOT_FOUND, PASSWORD_MATCH } =
  errorEnum;

const getProfile = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId, {
      __v: false,
      password: false,
    }).exec();

    const isClient = await Client.findById(userId, {
      __v: false,
      password: false,
    }).exec();

    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});

    const userInfo = isFreelancer || isClient;

    return res.status(OK).json(userInfo);
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);

    const isClient = await Client.findById(userId);

    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});

    const userInfo = isFreelancer || isClient;

    const userType = userInfo.userType;

    const updateKeys = UpdateProfileService(req.body, userType);

    userType === userTypes.FREELANCER
      ? await Freelancer.findByIdAndUpdate(userId, { ...updateKeys })
      : await Client.findByIdAndUpdate(userId, { ...updateKeys });

    return res.status(NO_CONTENT).json({});
  } catch (err) {
    return next(err);
  }
};

const sendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    userDataValidator(EMAIL, email);
    const isFreelancer = await Freelancer.findOne({ email });
    const isClient = await Client.findOne({ email });
    if (!isFreelancer && !isClient) throw new AppError(EMAIL_NOT_FOUND);
    const userInfo = isClient || isFreelancer;
    if (userInfo.verified) throw new AppError(EMAIL_VERIFIED);
    await SendVerificationEmail(email);
    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const token = req.query.token;
    const decoded = verifyToken(token, tokenTypes.PUBLIC);
    if (decoded instanceof Error) throw new AppError(INVALID_AUTH);
    const { email } = decoded;
    const isFreelancer = await Freelancer.findOne({ email });
    const isClient = await Client.findOne({ email });
    if (!isFreelancer && !isClient) throw new AppError(EMAIL_NOT_FOUND);
    const userInfo = isClient || isFreelancer;
    if (userInfo.userType === userTypes.CLIENT)
      await Client.findById(userInfo._id).update({ verified: true });
    else await Freelancer.findById(userInfo._id).update({ verified: true });
    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

const sendReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    userDataValidator(EMAIL, email);
    const isFreelancer = await Freelancer.findOne({ email });
    const isClient = await Client.findOne({ email });
    if (!isFreelancer && !isClient) throw new AppError(EMAIL_NOT_FOUND);
    const userInfo = isFreelancer || isClient;
    await SendResetPasswordEmail(userInfo.fullName, email);
    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = verifyToken(token, tokenTypes.PUBLIC);
    if (decoded instanceof Error) throw new AppError(INVALID_AUTH);
    const { email } = decoded;
    const isFreelancer = await Freelancer.findOne({ email });
    const isClient = await Client.findOne({ email });

    const userInfo = isFreelancer || isClient;
    if (!userInfo) throw new AppError(EMAIL_NOT_FOUND);

    const { password } = req.body;

    const isPasswordMatch = compareSync(password, userInfo.password);

    if(isPasswordMatch) throw new AppError(PASSWORD_MATCH);

    userDataValidator(PASSWORD, password);

    // hash plain password
    const hashPass = hashSync(password, 15);

    if (userInfo.userType === userTypes.CLIENT)
      await Client.findOne({ email }).update({ password: hashPass });
    else await Freelancer.findOne({ email }).update({ password: hashPass });
    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

export {
  getProfile,
  updateProfile,
  sendVerification,
  verifyUser,
  sendReset,
  resetPassword,
};
