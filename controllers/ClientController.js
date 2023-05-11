import { default as Client } from '../mongodb/models/Client.js'
import { default as UserInfo } from "../mongodb/models/UserInfo.js";
import CreateUserInfoService from "../services/CreateUserInfoService.js";
import { errorEnum, httpResponseCodes } from "../constants/errorCodes.js";
import AppError from "../constants/AppError.js";
import { isNull } from "../utils/checkValidity.js";

const { USERNAME_EXIST, EMAIL_EXIST, USER_ID_REQUIRED } = errorEnum;
const { CREATED, NOT_FOUND, OK } = httpResponseCodes;

const createClient = async (req, res, next) => {
    try {
        // Get user input
        const {
          username,
          fullName,
          email,
          password,
        } = req.body;
    
        // Validate user input
        const validUserInfo = CreateUserInfoService({
          username,
          fullName,
          email,
          password,
        });
    
        // Check if user already exist
        // Validate if user exist in our database
        const isUsernameExists = await UserInfo.findOne({ username });
        const isEmailExists = await UserInfo.findOne({ email });
    
        if (isUsernameExists) throw new AppError(USERNAME_EXIST);
        if (isEmailExists) throw new AppError(EMAIL_EXIST);
    
        // Create user info in our database
        const newUserInfo = await UserInfo.create(validUserInfo);
    
        // Create client in our database
        await Client.create({
          userInfo: newUserInfo._id,
        });
    
        return res.status(CREATED).json({});
      } catch (err) {
        return next(err);
      }
}

const getClient = async (req, res, next) => {
    try{
        // Get client ID
        const id = req.params.id;
    
        // Check if valid id
        if(isNull(id)) throw new AppError(USER_ID_REQUIRED);
    
        // Get client data
        const clientData = await Client.findById(id, { _id: false, __v: false }).exec();
    
        // Check if found client 
        if(!clientData) return res.status(NOT_FOUND).json({});
    
        // Get client userInfo
        const userInfo = await UserInfo.findById(clientData.userInfo._id, { _id: false, __v: false }).exec();
    
        // Check if found client userInfo 
        if(!userInfo) return res.status(NOT_FOUND).json({});
    
        // Gather all client info
        const allData = {
          ...clientData.toJSON(),
          ...userInfo.toJSON()
        }
    
        // Sanitize returned data
        delete allData.password;
        delete allData.userInfo;
    
        return res.status(OK).json(allData);
    
      } catch(err){
        return next(err);
      }
    
}

export { createClient, getClient };