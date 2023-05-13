import validator from "validator";
import {
  isNull,
  isEmpty,
  hasLength,
  isArray,
  isMember,
  isBetween,
  isNum,
} from "./checkValidity.js";
import AppError from "../constants/AppError.js";
import { errorEnum } from "../constants/errorCodes.js";
import { freelancerTypes } from "../constants/models.js";
import { userData } from "../constants/userData.js";

const {
  ALL_FIELDS_REQUIRED,
  INVALID_USERNAME,
  INVALID_FULLNAME,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  INVALID_FREELANCER_TYPE,
  INVALID_ADDRESS,
  INVALID_PHONE,
  INVALID_HOURLY_RATE,
  INVALID_DESCRIPTION,
} = errorEnum;
const { matches, isEmail, isMobilePhone } = validator;
const {
  USERNAME,
  FULLNAME,
  EMAIL,
  PASSWORD,
  FREELANCER_TYPE,
  ADDRESS,
  PHONE_NUM,
  HOURLY_RATE,
  DESCRIPTION,
} = userData;

const userDataValidator = (dataType, data) => {
    switch (dataType) {
      
      case USERNAME:
          if (isNull(data) || isEmpty(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!matches(data, new RegExp(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/)))
              throw new AppError(INVALID_USERNAME);
  
      break;
  
      case FULLNAME:
          if (isNull(data) || isEmpty(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!matches(data, new RegExp(/^[a-zA-Z]{4,}((?: [a-zA-Z]+){0,2})/)))
              throw new AppError(INVALID_FULLNAME);
  
      break;
  
      case EMAIL:
          if (isNull(data) || isEmpty(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!isEmail(data))
              throw new AppError(INVALID_EMAIL);
  
      break;
  
      case PASSWORD:
          if (isNull(data) || isEmpty(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!matches(data, new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#.?_!@$%^&*-]).{8,32}$/)))
              throw new AppError(INVALID_PASSWORD);
  
      break;
  
      case FREELANCER_TYPE:
          if (isNull(data) || isEmpty(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!isMember(data, Object.values(freelancerTypes)))
              throw new AppError(INVALID_FREELANCER_TYPE);
  
      break;
  
      case ADDRESS:
          if (isNull(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!(isArray(data) && hasLength(data, 2) && data.reduce((acc, cur) => acc && isNum(cur), true)))
              throw new AppError(INVALID_ADDRESS);
  
      break;
  
      case PHONE_NUM:
          if (isNull(data) || isEmpty(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!isMobilePhone(data, "ar-EG"))
              throw new AppError(INVALID_PHONE);
  
      break;
  
      case HOURLY_RATE:
          if (isNull(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!(isNum(data) && isBetween(9, data, 1001)))
              throw new AppError(INVALID_HOURLY_RATE);
  
      break;
  
      case DESCRIPTION:
          if (isNull(data) || isEmpty(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
          if (!isBetween(19, data.length, 1001))
              throw new AppError(INVALID_DESCRIPTION);
  
      break;
  
      default:
          if (isNull(data))
              throw new AppError(ALL_FIELDS_REQUIRED);
    }
  
    /*
    [userData.USERNAME]: (username) => {
      if (isNull(username) || isEmpty(username))
        throw new AppError(ALL_FIELDS_REQUIRED);
      if (
        !matches(
          username,
          new RegExp(
            /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/
          )
        )
      )
        throw new AppError(INVALID_USERNAME);
    },
  
    [userData.FULLNAME]: (fullName) => {
      if (isNull(fullName) || isEmpty(fullName))
        throw new AppError(ALL_FIELDS_REQUIRED);
      if (!matches(fullName, new RegExp(/^[a-zA-Z]{4,}((?: [a-zA-Z]+){0,2})/)))
        throw new AppError(INVALID_FULLNAME);
    },
  
    [userData.EMAIL]: (email) => {
      if (isNull(email) || isEmpty(email))
        throw new AppError(ALL_FIELDS_REQUIRED);
      if (!isEmail(email)) throw new AppError(INVALID_EMAIL);
    },
  
    [userData.PASSWORD]: (password) => {
      if (isNull(password) || isEmpty(password))
        throw new AppError(ALL_FIELDS_REQUIRED);
      if (
        (!matches(password),
        new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#.?_!@$%^&*-]).{8,32}$/
        ))
      )
        throw new AppError(INVALID_PASSWORD);
    },
  
    [userData.FREELANCER_TYPE]: (freelancerType) => {
      if (isNull(freelancerType) || isEmpty(freelancerType))
        throw new AppError(ALL_FIELDS_REQUIRED);
      if (!isMember(freelancerType, Object.values(freelancerTypes)))
        throw new AppError(INVALID_FREELANCER_TYPE);
    },
  
    [userData.ADDRESS]: (address) => {
      if (isNull(address)) throw new AppError(ALL_FIELDS_REQUIRED);
      if (
        !(
          isArray(address) &&
          hasLength(address, 2) &&
          address.reduce((acc, cur) => acc && isNum(cur), true)
        )
      )
        throw new AppError(INVALID_ADDRESS);
    },
  
    [userData.PHONE_NUM]: (phoneNum) => {
      if (isNull(phoneNum) || isEmpty(phoneNum))
        throw new AppError(ALL_FIELDS_REQUIRED);
      if (!isMobilePhone(phoneNum, "ar-EG")) throw new AppError(INVALID_PHONE);
    },
  
    [userData.HOURLY_RATE]: (hourlyRate) => {
      if (isNull(hourlyRate)) throw new AppError(ALL_FIELDS_REQUIRED);
      if (!(isNum(hourlyRate) && isBetween(9, hourlyRate, 1001)))
        throw new AppError(INVALID_HOURLY_RATE);
    },
  
    [userData.DESCRIPTION]: (description) => {
      if (isNull(description) || isEmpty(description))
        throw new AppError(ALL_FIELDS_REQUIRED);
      if (!isBetween(19, description.length, 1001))
        throw new AppError(INVALID_DESCRIPTION);
    },
    */
  };
  
export default userDataValidator;