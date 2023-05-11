import AppError from "../constants/AppError.js";
import { errorEnum } from "../constants/errorCodes.js";
import { freelancerType } from "../constants/freelancer.js";
import validator from "validator";
import {
  isNull,
  isEmpty,
  isArray,
  isNum,
  isBetween,
  hasLength,
  isMember,
} from "../utils/checkValidity.js";

const { isMobilePhone } = validator;

const {
  ALL_FIELDS_REQUIRED,
  INVALID_FREELANCER_TYPE,
  INVALID_LOCATION,
  INVALID_BIO,
  INVALID_HOURLY_RATE,
  INVALID_PHONE,
} = errorEnum;

const CreateFreelancerInfo = ({
  type,
  address,
  phoneNum,
  hourlyRate,
  description,
}) => {
  // Validate user input
  if (
    isNull(type) ||
    isNull(address) ||
    isNull(phoneNum) ||
    isNull(hourlyRate) ||
    isNull(description) ||
    isEmpty(type) ||
    isEmpty(phoneNum) ||
    isEmpty(description)
  )
    throw new AppError(ALL_FIELDS_REQUIRED);

  // Check if type is valid
  if (!isMember(type, Object.values(freelancerType)))
    throw new AppError(INVALID_FREELANCER_TYPE);

  // Check if address is valid
  if (
    !(
      isArray(address) &&
      hasLength(address, 2) &&
      address.reduce((acc, cur) => acc && isNum(cur), true)
    )
  )
    throw new AppError(INVALID_LOCATION);

  if (!isBetween(19, description.length, 1001)) throw new AppError(INVALID_BIO);

  // Check if hourly rate is valid
  if (!(isNum(hourlyRate) && isBetween(9, hourlyRate, 1001)))
    throw new AppError(INVALID_HOURLY_RATE);

  // Check if phone number is valid egyptian number
  if (!isMobilePhone(phoneNum, "ar-EG")) throw new AppError(INVALID_PHONE);

  return {
    type,
    address,
    phoneNum,
    hourlyRate,
    description,
  };
};

export default CreateFreelancerInfo;
