import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import { hash } from "bcrypt";
import isEmail from "validator/lib/isEmail.js";
import isEmpty from "validator/lib/isEmpty.js";
import normalizeEmail from "validator/lib/normalizeEmail.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";

const { ALL_FIELDS_REQUIRED, USERNAME_EXIST, EMAIL_EXIST, INVALID_EMAIL } = errorEnum
const { CREATED, OK, NOT_FOUND } = httpResponseCodes

const createUser = async (req, res, next) => {
  try {
    // Get user input
    const { username, fullName, email, password } = req.body;

    // Validate user input
    if (
      isEmpty(username) ||
      isEmpty(fullName) ||
      isEmpty(email) ||
      isEmpty(password)
    )
      return next(ALL_FIELDS_REQUIRED);

    // Check if email is valid
    if (!isEmail(email)) return next(INVALID_EMAIL);

    // Check if user already exist
    // Validate if user exist in our database
    const isUsernameExists = await UserInfo.findOne({ username });
    const isEmailExists = await UserInfo.findOne({ email });

    if (isUsernameExists) return next(USERNAME_EXIST);
    if (isEmailExists) return next(EMAIL_EXIST);

    //Encrypt user password
    hash(password, 10, async (err, hashPass) => {
      if (err) return next(err);

      const newUserInfo = {
        username,
        fullName,
        email: normalizeEmail(email),
        password: hashPass,
      };

      // Create user info in our database
      const userInfo = await UserInfo.create(newUserInfo);

      return res.status(CREATED).json({});
    });
  } catch (err) {
    return next(err);
  }
};

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

export { createUser, getProfile, updateProfile };
