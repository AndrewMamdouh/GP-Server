import { isEmpty, isNull } from "../utils/checkValidity.js";
import isEmail from "validator/lib/isemail.js";
import AppError from "../constants/AppError.js";
import { errorEnum } from "../constants/errorCodes.js";

const {
  ALL_FIELDS_REQUIRED,
  INVALID_EMAIL,
} = errorEnum;

const LoginService = ({ email, password }) => {
  // Validate user input
  if (
    isNull(email) ||
    isNull(password) ||
    isEmpty(email) ||
    isEmpty(password)
  )
    throw new AppError(ALL_FIELDS_REQUIRED);

  // Check if email is valid
  if (!isEmail(email)) throw new AppError(INVALID_EMAIL);

  return {
    email: email.toLowerCase(),
    password
  }

};

export default LoginService;
