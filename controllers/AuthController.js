import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import { createToken } from "../utils/jwt.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import isEmail from "validator/lib/isEmail.js";
import isEmpty from "validator/lib/isempty.js";

const { INTERNAL_ERROR, ALL_FIELDS_REQUIRED, INVALID_EMAIL, AUTH_REQUIRED, EMAIL_NOT_FOUND } = errorEnum
const { CREATED, OK, NOT_FOUND } = httpResponseCodes

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (isEmpty(email) || isEmpty(password))
      return next(ALL_FIELDS_REQUIRED);

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

    // Assigning refresh token in http-only cookie
    res.cookie("Auth", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 365,
    });

    // return access token
    return res.status(OK).json({ access, refresh });
  } catch (err) {
    console.log(err);
    return next(INTERNAL_ERROR);
  }
};

const refreshToken = async (req, res, next) => {
  try {
  const { refresh } = req.body;

  if (!refresh) return next(AUTH_REQUIRED);

    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    console.log(refreshToken)

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

export { login, refreshToken };
