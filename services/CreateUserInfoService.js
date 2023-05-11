import { hashSync } from "bcrypt";
import { isEmpty, isNull } from "../utils/checkValidity.js";
import isEmail from "validator/lib/isemail.js";
import matches from "validator/lib/matches.js";
import normalizeEmail from "validator/lib/normalizeemail.js";
import AppError from "../constants/AppError.js";
import { errorEnum } from "../constants/errorCodes.js";

const {
  ALL_FIELDS_REQUIRED,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  INVALID_FULLNAME,
  INVALID_USERNAME,
} = errorEnum;

const CreateUserInfoService = ({ username, fullName, email, password }) => {
  // Validate user input
  if (
    isNull(username) ||
    isNull(fullName) ||
    isNull(email) ||
    isNull(password) ||
    isEmpty(username) ||
    isEmpty(fullName) ||
    isEmpty(email) ||
    isEmpty(password)
  )
    throw new AppError(ALL_FIELDS_REQUIRED);

  // Check if username is valid
  if (
    !matches(
      username,
      new RegExp(
        /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/
      )
    )
  )
    throw new AppError(INVALID_USERNAME);

  // Check if full name is valid
  if (!matches(fullName, new RegExp(/^[a-zA-Z]{4,}((?: [a-zA-Z]+){0,2})/)))
    throw new AppError(INVALID_FULLNAME);

  // Check if email is valid
  if (!isEmail(email)) throw new AppError(INVALID_EMAIL);

  // Check if password is valid
  if (
    !matches(
      password,
      new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#.?_!@$%^&*-]).{8,32}$/)
    )
  )
    throw new AppError(INVALID_PASSWORD);

  // hash plain password
  const hashPass = hashSync(password, 15);

  return {
    username,
    fullName,
    email: normalizeEmail(email),
    password: hashPass,
  };
};

export default CreateUserInfoService;
