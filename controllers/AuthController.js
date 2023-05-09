import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import { createToken } from "../utils/jwt.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import isEmail from "validator/lib/isEmail.js";
import isEmpty from "validator/lib/isempty.js";
import { verifyToken } from "../utils/jwt.js";
import { default as TokenModel } from "../mongodb/models/Token.js";

const { ALL_FIELDS_REQUIRED, INVALID_EMAIL, AUTH_REQUIRED, EMAIL_NOT_FOUND } = errorEnum;
const { OK } = httpResponseCodes;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (isEmpty(email) || isEmpty(password)) return next(ALL_FIELDS_REQUIRED);

    // Check if email is valid
    if (!isEmail(email)) return next(INVALID_EMAIL);

    // Check if user already exist
    // Validate if user exist in our database
    const userInfo = await UserInfo.findOne({ email });
    if (!userInfo) return next(EMAIL_NOT_FOUND);

    // Create access token
    const access = createToken({ id: userInfo._id }, "ACCESS");

    // Creating refresh token
    const refresh = createToken({ id: userInfo._id }, "REFRESH");


    const newTokenInfo = {
      _userId: userInfo._id, 
      token: refresh
    };

    console.log('refresh: ', refresh);

    // Create token in our database
    await TokenModel.create(newTokenInfo);

    // Assigning refresh token in signed cookie
    res.cookie("Auth", refresh, {
      signed: true,
      maxAge: 60 * 60 * 24 * 365,
    });

    // return access token
    return res.status(OK).json({ access });
  } catch (err) {
    return next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.signedCookies.Auth;

    if (!refreshToken) return next(AUTH_REQUIRED);

    const result = verifyToken(refreshToken, "REFRESH");

    if (
      (result instanceof Error && result.name === "TokenExpiredError") ||
      !(result instanceof Error)
    ) {

      //Get token from database
      const dbToken = await TokenModel.findOne({ token: refreshToken })

      if(!dbToken) return res.status(httpResponseCodes.NOT_FOUND).json({});

      // Create access token
      const access = createToken({ id: dbToken._id }, "ACCESS");

      // Creating refresh token
      const refresh = createToken({ id: dbToken._id }, "REFRESH");

      console.log("new refresh: ", refresh);

      // Update token in database
      await TokenModel.updateOne({ token: refreshToken }, { token: refresh })

      // Assigning refresh token in new signed cookie
      res.cookie("Auth", refresh, { signed: true });

      // return access token
      return res.status(OK).json({ access });
    }

    return next(errorEnum.INVALID_AUTH);
  } catch (err) {
    return next(err);
  }
};

export { login, refreshToken };
