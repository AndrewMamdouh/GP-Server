import { isEmpty, isNull, isString, isBetween, isNum } from "../utils/checkValidity.js";
import validator from "validator";
import AppError from "../constants/AppError.js";
import { errorEnum } from "../constants/errorCodes.js";
import { userTypes } from "../constants/models.js";

const { isMobilePhone, matches } = validator;
const { ALL_FIELDS_REQUIRED, INVALID_FULLNAME, INVALID_USERNAME, INVALID_BIO, INVALID_HOURLY_RATE, INVALID_PHONE } = errorEnum;

const UpdateProfileService = (profileData, userType) => {
  // Validate user input
  const hasNull = Object.values(profileData).reduce(
    (acc, cur) => isNull(cur) || (isString(cur) ? isEmpty(cur) : false) || acc,
    false
  );

  if (hasNull) throw new AppError(ALL_FIELDS_REQUIRED);

  // Check if username is valid
  if (
    profileData.username &&
    !matches(
        profileData.username,
      new RegExp(
        /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/
      )
    )
  )
    throw new AppError(INVALID_USERNAME);

  // Check if full name is valid
  if (
    profileData.fullName &&
    !matches(profileData.fullName, new RegExp(/^[a-zA-Z]{4,}((?: [a-zA-Z]+){0,2})/))
  )
    throw new AppError(INVALID_FULLNAME);

  if (userType === userTypes.FREELANCER) {
    if (profileData.description && !isBetween(19, profileData.description.length, 1001))
      throw new AppError(INVALID_BIO);

    // Check if hourly rate is valid
    if (
        profileData.hourlyRate &&
      !(isNum(profileData.hourlyRate) && isBetween(9, profileData.hourlyRate, 1001))
    )
      throw new AppError(INVALID_HOURLY_RATE);

    // Check if phone number is valid egyptian number
    if (profileData.phoneNum && !isMobilePhone(profileData.phoneNum, "ar-EG"))
      throw new AppError(INVALID_PHONE);
  }
};

export default UpdateProfileService;
