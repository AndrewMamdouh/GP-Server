import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import { hash } from "bcrypt";
import validator from "validator";
import {
  isNull,
  isEmpty,
  isArray,
  isNum,
  isBetween,
  hasLength,
} from "../utils/checkValidity.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import { getCity } from "../services/getCity.js";

const {
  ALL_FIELDS_REQUIRED,
  USERNAME_EXIST,
  EMAIL_EXIST,
  INVALID_EMAIL,
  INVALID_LOCATION,
  INVALID_HOURLY_RATE,
  INVALID_PHONE,
  INVALID_BIO,
} = errorEnum;
const { CREATED } = httpResponseCodes;

const { isMobilePhone, isEmail, normalizeEmail } = validator;

const createFreelancer = async (req, res, next) => {
  try {
    // Get user input
    const {
      username,
      fullName,
      email,
      password,
      address,
      phoneNum,
      hourlyRate,
      description,
    } = req.body;

    // Validate user input
    if (
      isNull(username) ||
      isNull(fullName) ||
      isNull(email) ||
      isNull(password) ||
      isNull(phoneNum) ||
      isNull(description) ||
      isNull(address) ||
      isNull(hourlyRate) ||
      isEmpty(username) ||
      isEmpty(fullName) ||
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(phoneNum) ||
      isEmpty(description)
    )
      return next(ALL_FIELDS_REQUIRED);

    // Check if email is valid
    if (!isEmail(email)) return next(INVALID_EMAIL);

    // Check if address is valid
    if (
      !(
        isArray(address) &&
        hasLength(address, 2) &&
        address.reduce((acc, cur) => acc && isNum(cur), true)
      )
    )
      return next(INVALID_LOCATION);

    if (!isBetween(19, description.length, 1001)) return next(INVALID_BIO);

    // Check if hourly rate is valid
    if (!(isNum(hourlyRate) && isBetween(9, hourlyRate, 1001)))
      return next(INVALID_HOURLY_RATE);

    // Check if phone number is valid egyptian number
    if (!isMobilePhone(phoneNum, "ar-EG")) return next(INVALID_PHONE);

    // Check if user already exist
    // Validate if user exist in our database
    const isUsernameExists = await UserInfo.findOne({ username });
    const isEmailExists = await UserInfo.findOne({ email });

    if (isUsernameExists) return next(USERNAME_EXIST);
    if (isEmailExists) return next(EMAIL_EXIST);

    //Encrypt user password
    hash(password, 10, async (err, hashPass) => {
      if (err) return next(err);

      const result = await getCity(...address);

      const newUserInfo = {
        username,
        fullName,
        email: normalizeEmail(email),
        password: hashPass,
      };

      // Create user info in our database
      const userInfo = await UserInfo.create(newUserInfo);

      const newFreelancerInfo = {
        phoneNum,
        hourlyRate: Math.trunc(hourlyRate),
        description,
        address: {
          name: result.address.state,
          location: {
            coordinates: address,
          },
        },
      };

      // Create freelancer in our database
      await Freelancer.create({
        userInfo: userInfo._id,
        ...newFreelancerInfo,
      });

      return res.status(CREATED).json({});
    });
  } catch (err) {
    return next(err);
  }
};

const getFreelancer = async (req, res) => {
  res.json("Freelancer Returned!");
};

export { createFreelancer, getFreelancer };
