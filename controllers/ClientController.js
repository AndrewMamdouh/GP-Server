import { default as Client } from "../mongodb/models/Client.js";
import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import CreateUserInfoService from "../services/CreateUserInfoService.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import AppError from "../constants/AppError.js";
import { isNull } from "../utils/checkValidity.js";

const { USERNAME_EXIST, EMAIL_EXIST, USER_ID_REQUIRED } = errorEnum;
const { CREATED, NOT_FOUND, OK } = httpResponseCodes;

const createClient = async (req, res, next) => {
  try {
    // Get user input
    const { username, fullName, email, password } = req.body;

    // Validate user input
    const validUserInfo = CreateUserInfoService({
      username,
      fullName,
      email,
      password,
    });

    // Check if user already exist
    const isFreelancerUsernameExists = await Freelancer.findOne({ username: validUserInfo.username });
    const isClientUsernameExists = await Client.findOne({ username: validUserInfo.username });
    const isFreelancerEmailExists = await Freelancer.findOne({ email: validUserInfo.email });
    const isClientEmailExists = await Client.findOne({ email: validUserInfo.email });

    if (isFreelancerUsernameExists || isClientUsernameExists)
      throw new AppError(USERNAME_EXIST);
    if (isFreelancerEmailExists || isClientEmailExists)
      throw new AppError(EMAIL_EXIST);

    // Create client in our database
    await Client.create(validUserInfo);

    return res.status(CREATED).json({});
  } catch (err) {
    return next(err);
  }
};

const getClient = async (req, res, next) => {
  try {
    // Get client ID
    const id = req.params.id;

    // Check if valid id
    if (isNull(id)) throw new AppError(USER_ID_REQUIRED);

    // Get client data
    const clientData = await Client.findById(id, {
      _id: false,
      __v: false,
      password: false,
    }).exec();

    // Check if found client
    if (!clientData) return res.status(NOT_FOUND).json({});

    // Gather all client info
    const allData = {
      ...clientData.toJSON(),
    };

    return res.status(OK).json(allData);
  } catch (err) {
    return next(err);
  }
};

export { createClient, getClient };
