import { compareSync } from 'bcrypt';
import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import { createToken } from "../utils/jwt.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import { verifyToken } from "../utils/jwt.js";
import { default as TokenModel } from "../mongodb/models/Token.js";
import LoginService from "../services/LoginService.js";
import AppError from "../constants/AppError.js";

const { AUTH_REQUIRED, EMAIL_NOT_FOUND, WRONG_PASSWORD } = errorEnum;
const { OK } = httpResponseCodes;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validCredentials = LoginService({ email, password });

    // Check if user already exist
    // Validate if user exist in our database
    const userInfo = await UserInfo.findOne({ email: validCredentials.email });
    if (!userInfo) throw new AppError(EMAIL_NOT_FOUND);

    const isPasswordValid = compareSync(password, userInfo.password);

    if(!isPasswordValid) throw new AppError(WRONG_PASSWORD);

    // Create access token
    const access = createToken({ id: userInfo._id }, "ACCESS");

    // Creating refresh token
    const refresh = createToken({ id: userInfo._id }, "REFRESH");


    const newTokenInfo = {
      _userId: userInfo._id, 
      token: refresh
    };

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

    if (!refreshToken) throw new AppError(AUTH_REQUIRED);

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

      // Update token in database
      await TokenModel.updateOne({ token: refreshToken }, { token: refresh })

      // Assigning refresh token in new signed cookie
      res.cookie("Auth", refresh, { signed: true });

      // return access token
      return res.status(OK).json({ access });
    }

    throw new AppError(errorEnum.INVALID_AUTH);
  } catch (err) {
    return next(err);
  }
};

export { login, refreshToken };
