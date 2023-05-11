import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as UserInfo } from "../mongodb/models/UserInfo.js";
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
      type,
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

const getFreelancer = async (req, res, next) => {
  try{
    // Get freelancer ID
    const id = req.params.id;

    // Check if valid id
    if(isNull(id)) throw new AppError(USER_ID_REQUIRED);

    // Get freelancer data
    const freelancerData = await Freelancer.findById(id, { _id: false, __v: false }).exec();

    // Check if found freelancer 
    if(!freelancerData) return res.status(NOT_FOUND).json({});

    // Get freelancer userInfo
    const userInfo = await UserInfo.findById(freelancerData.userInfo._id, { _id: false, __v: false }).exec();

    // Check if found freelancer userInfo 
    if(!userInfo) return res.status(NOT_FOUND).json({});

    // Gather all freelancer info
    const allData = {
      ...freelancerData.toJSON(),
      ...userInfo.toJSON()
    }

    console.log(allData)

    // Sanitize returned data
    delete allData.password;
    delete allData.userInfo;

    console.log(allData)

    return res.status(OK).json(allData);

  } catch(err){
    return next(err);
  }
};

export { createFreelancer, getFreelancer };
