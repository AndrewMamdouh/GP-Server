import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import { default as User } from "../mongodb/models/User.js";
import { hash } from "bcrypt";
//import { createToken } from "../utils/jwt.js";
import isEmail from "validator/lib/isEmail.js";
import isEmpty from "validator/lib/isEmpty.js";
import normalizeEmail from "validator/lib/normalizeEmail.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";

const { INTERNAL_ERROR, ALL_FIELDS_REQUIRED, USERNAME_EXIST, EMAIL_EXIST, INVALID_EMAIL } = errorEnum
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
      if (err) return next(INTERNAL_ERROR);

      const newUserInfo = {
        username,
        fullName,
        email: normalizeEmail(email),
        password: hashPass,
      };

      // Create user info in our database
      const userInfo = await UserInfo.create(newUserInfo);

      // Create user in our database
      await User.create({
        userInfo,
      });

      // Create access token
      //const access = createToken({ username } , "ACCESS");

      // Creating refresh token
      //const refresh = createToken({ username }, "REFRESH");

      // Assigning refresh token in http-only cookie
      // res.cookie("Auth", refresh, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'none',
      //   maxAge: 60 * 60 * 24 * 365,
      // });

      // return access token
      //return res.status(201).json({ access });

      return res.status(CREATED).json({});
    });
  } catch (err) {
    console.log(err);
    return next(INTERNAL_ERROR);
  }
};

const getProfile = async (req, res, next) => {
  try {
    if(!req.user) return res;
    const userInfo = await UserInfo.findOne(req.user);
    if (!userInfo) return res.status(NOT_FOUND);
    return res.status(OK).json(userInfo);
  } catch (err) {
    console.log(err);
    return next(INTERNAL_ERROR);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if(!req.user) return res;
    await UserInfo.updateOne(req.user, req.body);
    const newUserInfo = await UserInfo.findOne(req.body);
    return res.status(OK).json(newUserInfo);
  } catch (err) {
    console.log(err);
    return next(INTERNAL_ERROR);
  }
};

export { createUser, getProfile, updateProfile };
