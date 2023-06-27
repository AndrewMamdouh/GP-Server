import { default as Client } from "../mongodb/models/Client.js";
import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import CreateUserInfoService from "../services/CreateUserInfoService.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import AppError from "../constants/AppError.js";
import { isEmpty, isNull, isString } from "../utils/checkValidity.js";
import SendVerificationEmail from "../services/SendVerificationEmail.js";
import { isValidObjectId } from "mongoose";

const { USERNAME_EXIST, EMAIL_EXIST, INVALID_ID, FAV_EXIST } = errorEnum;
const { CREATED, NOT_FOUND, OK, FORBIDDEN, BAD_REQUEST, NO_CONTENT } = httpResponseCodes;

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

    // Check if id is valid
    if (!isValidObjectId(id)) throw new AppError(INVALID_ID);

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

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);
    const isClient = await Client.findById(userId);

    if (isFreelancer) return res.status(FORBIDDEN).json({});
    if (!isClient) return res.status(NOT_FOUND).json({});

    // Get visited Freelancer id
    const { id } = req.body;

    // Check if id is valid
    if (!isValidObjectId(id)) throw new AppError(INVALID_ID);

    // Check if id valid
    const isFreelancerExists = await Freelancer.findById(id);

    if (!isFreelancerExists) return res.status(NOT_FOUND).json({});

    await isClient.updateOne({ $addToSet: { visitList: id } });

    return res.status(OK).json({});
  } catch (err) {
    return next(err);
  }
};

const addToFavList = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);
    const isClient = await Client.findById(userId);

    if (isFreelancer) return res.status(FORBIDDEN).json({});
    if (!isClient) return res.status(NOT_FOUND).json({});

    // Get Freelancer id
    const { id } = req.body;

    // Check if id is valid
    if (!isValidObjectId(id)) throw new AppError(INVALID_ID);

    // Check if id valid
    const isFreelancerExists = await Freelancer.findById(id);

    if (!isFreelancerExists) return res.status(NOT_FOUND).json({});

    const freelancerInFav = await Client.find({ favList: { $in: [id] } });

    if(freelancerInFav) throw new AppError(FAV_EXIST);

    await isClient.updateOne({ $addToSet: { favList: id } });

    return res.status(OK).json({});
  } catch (err) {
    return next(err);
  }
};

const removeFromFavList = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);
    const isClient = await Client.findById(userId);

    if (isFreelancer) return res.status(FORBIDDEN).json({});
    if (!isClient) return res.status(NOT_FOUND).json({});

    // Get Freelancer id
    const id = req.params.id;

    // Check if id is valid
    if (!isValidObjectId(id)) throw new AppError(INVALID_ID);

    // Check if id valid
    const isFreelancerExists = await Freelancer.findById(id);

    if (!isFreelancerExists) return res.status(NOT_FOUND).json({});

    const freelancerInFav = await Client.find({ favList: { $in: [id] } });

    if(!freelancerInFav) return res.status(NOT_FOUND).json({});

    await isClient.updateOne({ $pull: { favList: id } });

    return res.status(NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
};

const search = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);
    const isClient = await Client.findById(userId);

    if (isFreelancer) return res.status(FORBIDDEN).json({});
    if (!isClient) return res.status(NOT_FOUND).json({});

    // Get search query
    const { query } = req.query;

    if (isNull(query) || !isString(query) || isEmpty(query))
      return res.status(BAD_REQUEST).json({});

    const regex = new RegExp(".*" + query + ".*", "i");

    // Get freelancers matching query
    const results = await Freelancer.find(
      {
        $or: [{ username: { $regex: regex } }, { fullName: { $regex: regex } }],
      },
      {
        __v: false,
        password: false,
      }
    );

    return res.status(OK).json({ results });
  } catch (err) {
    return next(err);
  }
};

export {
  createClient,
  getClient,
  addToVisitList,
  addToFavList,
  removeFromFavList,
  search,
};
