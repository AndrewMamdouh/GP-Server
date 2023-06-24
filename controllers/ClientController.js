import { default as Client } from "../mongodb/models/Client.js";
import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import CreateUserInfoService from "../services/CreateUserInfoService.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import AppError from "../constants/AppError.js";
import { isEmpty, isNull, isString } from "../utils/checkValidity.js";
import SendVerificationEmail from "../services/SendVerificationEmail.js";
import removeDuplicates from "../utils/removeDuplicates.js";

const { USERNAME_EXIST, EMAIL_EXIST, USER_ID_REQUIRED } = errorEnum;
const { CREATED, NOT_FOUND, OK, FORBIDDEN, BAD_REQUEST } = httpResponseCodes;

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
    const isFreelancerUsernameExists = await Freelancer.findOne({
      username: validUserInfo.username,
    });
    const isClientUsernameExists = await Client.findOne({
      username: validUserInfo.username,
    });
    const isFreelancerEmailExists = await Freelancer.findOne({
      email: validUserInfo.email,
    });
    const isClientEmailExists = await Client.findOne({
      email: validUserInfo.email,
    });

    if (isFreelancerUsernameExists || isClientUsernameExists)
      throw new AppError(USERNAME_EXIST);
    if (isFreelancerEmailExists || isClientEmailExists)
      throw new AppError(EMAIL_EXIST);

    // Create client in our database
    await Client.create(validUserInfo);

    // Send verification email
    await SendVerificationEmail(validUserInfo.email);

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
    if (isNull(id) || !isString(id) || isEmpty(id))
      throw new AppError(USER_ID_REQUIRED);

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

const addToVisitList = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const isFreelancer = await Freelancer.findById(req.user.id);
    const isClient = await Client.findById(req.user.id);

    if (isFreelancer || !isClient) return res.status(FORBIDDEN).json({});

    // Get visited Freelancer id
    const { id } = req.body;

    // Check if freelancer id valid
    const isFreelancerExists = await Freelancer.findById(id);

    if (!isFreelancerExists) return res.status(NOT_FOUND).json({});

    await isClient.updateOne({ $addToSet: { visitList: id } });

    return res.status(OK).json({});
  } catch (err) {
    return next(err);
  }
};

const search = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const isFreelancer = await Freelancer.findById(req.user.id);
    const isClient = await Client.findById(req.user.id);

    if (isFreelancer || !isClient) return res.status(FORBIDDEN).json({});

    // Get search query
    const { query } = req.query;

    if (isNull(query) || !isString(query) || isEmpty(query))
      return res.status(BAD_REQUEST).json({});

    const regex = new RegExp(".*" + query + ".*", "i");

    // Get freelancers matching query
    const results = await Freelancer.find(
      { $or: [{ username: { $regex: regex }}, { fullName: { $regex: regex }}]},
      {
        __v: false,
        password: false,
      }
    );

    console.log(results);

    return res.status(OK).json({ results });
  } catch (err) {
    return next(err);
  }
};

export { createClient, getClient, addToVisitList, search };
