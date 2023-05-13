import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as Client } from "../mongodb/models/Client.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import UpdateProfileService from "../services/UpdateProfileService.js";
import { userTypes } from "../constants/models.js";
import { verifyToken } from "../utils/jwt.js";
import AppError from "../constants/AppError.js";
import { isNull, isEmpty } from "../utils/checkValidity.js";
import matches from "validator/lib/matches.js";
import { tokenTypes } from "../constants/jwt.js";
import SendVerificationEmail from "../services/SendVerificationEmail.js";
import SendResetPasswordEmail from "../services/SendResetPasswordEmail.js";

const { NO_CONTENT, NOT_FOUND, OK } = httpResponseCodes;
const { INVALID_AUTH, INVALID_PASSWORD, ALL_FIELDS_REQUIRED, EMAIL_VERIFIED } = errorEnum;

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
    const newUserInfo =
      userType === userTypes.FREELANCER
        ? await Freelancer.updateOne({ _id: req.user.id }, { ...req.body })
        : await Client.updateOne({ _id: req.user.id }, { ...req.body });
    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

const sendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if(isNull(email) || isEmpty(email)) throw new AppError(ALL_FIELDS_REQUIRED);
    const isFreelancer = await Freelancer.findOne({ email });
    const isClient = await Client.findOne({ email });
    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});
    const userInfo = isClient || isFreelancer;
    if(userInfo.verified) throw new AppError(EMAIL_VERIFIED);
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
    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});
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
    if(isNull(email) || isEmpty(email)) throw new AppError(ALL_FIELDS_REQUIRED);
    const isFreelancer = await Freelancer.findOne({ email });
    const isClient = await Client.findOne({ email });
    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});
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
    if (!isFreelancer && !isClient) return res.status(NOT_FOUND).json({});

    const { password } = req.body;

    if (isNull(password) || isEmpty(password))
      throw new AppError(ALL_FIELDS_REQUIRED);
    if (
      !matches(
        password,
        new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#.?_!@$%^&*-]).{8,32}$/
        )
      )
    )
      throw new AppError(INVALID_PASSWORD);

      // hash plain password
  const hashPass = hashSync(password, 15);

    const userInfo = isClient || isFreelancer;
    if (userInfo.userType === userTypes.CLIENT)
      await Client.findOne({ email }).update({ password: hashPass });
    else await Freelancer.findOne({ email }).update({ password: hashPass });
    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

export { getProfile, updateProfile, sendVerification, verifyUser, sendReset, resetPassword };
