import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as Client } from "../mongodb/models/Client.js";
import CreateUserInfoService from "../services/CreateUserInfoService.js";
import CreateFreelancerInfoService from "../services/CreateFreelancerInfoService.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import AppError from "../constants/AppError.js";
import GetCity from "../services/GetCity.js";
import { isNull } from "../utils/checkValidity.js";

const { USERNAME_EXIST, EMAIL_EXIST, USER_ID_REQUIRED } = errorEnum;
const { CREATED, NOT_FOUND, OK } = httpResponseCodes;

const createFreelancer = async (req, res, next) => {
  try {
    // Get user input
    const {
      username,
      fullName,
      email,
      password,
      freelancerType,
      address,
      phoneNum,
      hourlyRate,
      description,
    } = req.body;

    // Validate user input
    const validUserInfo = CreateUserInfoService({
      username,
      fullName,
      email,
      password,
    });

    // Validate user input
    const validFreelancerInfo = CreateFreelancerInfoService({
      freelancerType,
      address,
      phoneNum,
      hourlyRate,
      description,
    });

    // Check if user already exist
    const isFreelancerUsernameExists = await Freelancer.findOne({ username });
    const isClientUsernameExists = await Client.findOne({ username });
    const isFreelancerEmailExists = await Freelancer.findOne({ email });
    const isClientEmailExists = await Client.findOne({ email });

    if (isFreelancerUsernameExists || isClientUsernameExists)
      throw new AppError(USERNAME_EXIST);
    if (isFreelancerEmailExists || isClientEmailExists)
      throw new AppError(EMAIL_EXIST);

    // Get User State
    const result = await GetCity(...validFreelancerInfo.address);

    const newFreelancerInfo = {
      ...validUserInfo,
      ...validFreelancerInfo,
      address: {
        name: result instanceof AppError ? "Egypt" : result.address.state,
        location: {
          coordinates: validFreelancerInfo.address,
        },
      },
    };

    // Create freelancer in our database
    await Freelancer.create(newFreelancerInfo);

    return res.status(CREATED).json({});
  } catch (err) {
    return next(err);
  }
};

const getFreelancer = async (req, res, next) => {
  try {
    // Get freelancer ID
    const id = req.params.id;

    // Check if valid id
    if (isNull(id)) throw new AppError(USER_ID_REQUIRED);

    // Get freelancer data
    const freelancerData = await Freelancer.findById(id, {
      _id: false,
      __v: false,
      password: false,
    }).exec();

    // Check if found freelancer
    if (!freelancerData) return res.status(NOT_FOUND).json({});

    // Gather all freelancer info
    const allData = {
      ...freelancerData.toJSON(),
    };

    return res.status(OK).json(allData);
  } catch (err) {
    return next(err);
  }
};

export { createFreelancer, getFreelancer };
