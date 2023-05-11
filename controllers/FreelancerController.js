import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import CreateUserInfo from "../services/createUserInfo.js";
import CreateFreelancerInfo from "../services/CreateFreelancerInfo.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import AppError from "../constants/AppError.js";
import GetCity from "../services/GetCity.js";

const { USERNAME_EXIST, EMAIL_EXIST } = errorEnum;
const { CREATED } = httpResponseCodes;

const createFreelancer = async (req, res, next) => {
  try {
    // Get user input
    const {
      username,
      fullName,
      email,
      password,
      type,
      address,
      phoneNum,
      hourlyRate,
      description,
    } = req.body;

    const validUserInfo = CreateUserInfo({
      username,
      fullName,
      email,
      password,
    });
    const validFreelancerInfo = CreateFreelancerInfo({
      type,
      address,
      phoneNum,
      hourlyRate,
      description,
    });

    // Check if user already exist
    // Validate if user exist in our database
    const isUsernameExists = await UserInfo.findOne({ username });
    const isEmailExists = await UserInfo.findOne({ email });

    if (isUsernameExists) throw new AppError(USERNAME_EXIST);
    if (isEmailExists) throw new AppError(EMAIL_EXIST);

    // Get User State
    const result = await GetCity(...validFreelancerInfo.address);

    // Create user info in our database
    const newUserInfo = await UserInfo.create(validUserInfo);

    const newFreelancerInfo = {
      userInfo: newUserInfo._id,
      ...validFreelancerInfo,
      address: {
        name: result instanceof AppError ? 'Egypt' : result.address.state,
        location: {
          coordinates: validFreelancerInfo.address,
        },
      },
    };

    // Create freelancer in our database
    await Freelancer.create({
      userInfo: newUserInfo._id,
      ...newFreelancerInfo,
    });

    return res.status(CREATED).json({});
  } catch (err) {
    return next(err);
  }
};

const getFreelancer = async (req, res) => {
  res.json("Freelancer Returned!");
};

export { createFreelancer, getFreelancer };
