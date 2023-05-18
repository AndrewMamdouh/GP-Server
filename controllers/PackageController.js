import { default as Package } from "../mongodb/models/Package.js";
import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as Client } from "../mongodb/models/Client.js";
import CreateFreelancerPackageService from "../services/CreateFreelancerPackageService.js";
import { userTypes } from "../constants/models.js";
import { httpResponseCodes } from "../constants/errorCodes.js";
import { errorEnum } from "../constants/errorCodes.js";
import { isNull } from "../utils/checkValidity.js";
import AppError from "../constants/AppError.js";
import freelancerPackageDataValidator from "../utils/freelancerPackageDataValidator.js";
import { freelancerPackageData } from "../constants/userData.js";

const { FORBIDDEN, NO_CONTENT, NOT_FOUND, CREATED, OK } = httpResponseCodes;
const { PACKAGE_ID_REQUIRED } = errorEnum
const { PHOTOS_NUM, DESCRIPTION } = freelancerPackageData

const createPackage = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const isFreelancer = await Freelancer.findById(req.user.id);
    const isClient = await Client.findById(req.user.id);

    const userInfo = isFreelancer || isClient;

    if (userInfo.userType === userTypes.CLIENT) return res.status(FORBIDDEN).json({});

    // Get package info
    const { photosNum, description } = req.body;

    // Validate package info
    const validPackageInfo = CreateFreelancerPackageService({
      photosNum,
      description,
    });

    // Create package in our database
    const newPackage = await Package.create({
      ...validPackageInfo,
      owner: userInfo._id,
    });

    // Add package to freelancer
    await Freelancer.findByIdAndUpdate(userInfo._id, {
        $addToSet: { packages: newPackage._id}
    })

    return res.status(CREATED).json({});
  } catch (err) {
    return next(err);
  }
};

const getPackage = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const isFreelancer = await Freelancer.findById(req.user.id);
    const isClient = await Client.findById(req.user.id);

    const userInfo = isFreelancer || isClient;

    if (userInfo.userType === userTypes.CLIENT) return res.status(FORBIDDEN).json({});

    // Get package ID
    const id = req.params.id;

    // Check if valid id
    if (isNull(id)) throw new AppError(PACKAGE_ID_REQUIRED);

    // Get package data
    const packageData = await Package.findById(id, {
      __v: false,
    });

    if(!packageData) return res.status(NOT_FOUND).json({});

    return res.status(OK).json(packageData);
  } catch (err) {
    return next(err);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const isFreelancer = await Freelancer.findById(req.user.id);
    const isClient = await Client.findById(req.user.id);

    const userInfo = isFreelancer || isClient;

    if (userInfo.userType === userTypes.CLIENT) return res.status(FORBIDDEN).json({});

     // Get package ID
     const id = req.params.id;

     // Check if valid id
     if (isNull(id)) throw new AppError(PACKAGE_ID_REQUIRED);
 
     // Get package data
     const packageData = await Package.findById(id);
 
     if(!packageData) return res.status(NOT_FOUND).json({});

    // Get package info
    const { photosNum, description } = req.body;

    // Validate package info
    photosNum && freelancerPackageDataValidator(PHOTOS_NUM, photosNum);
    description && freelancerPackageDataValidator(DESCRIPTION, description);

    // Update package in our database
    await Package.findByIdAndUpdate(id, { ...req.body })

    return res.status(NO_CONTENT).json({});
  } catch (err) {
    return next(err);
  }
};

const removePackage = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const isFreelancer = await Freelancer.findById(req.user.id);
    const isClient = await Client.findById(req.user.id);

    const userInfo = isFreelancer || isClient;

    if (userInfo.userType === userTypes.CLIENT) return res.status(FORBIDDEN).json({});

     // Get package ID
     const id = req.params.id;

     // Check if valid id
     if (isNull(id)) throw new AppError(PACKAGE_ID_REQUIRED);
 
     // Get package data
     const packageData = await Package.findById(id);
 
     if(!packageData) return res.status(NOT_FOUND).json({});

    // Delete package from our database
    await Package.findByIdAndDelete(id);

    // Delete package from freelancer packages
    await Freelancer.findByIdAndUpdate(userInfo._id, {
        $pull: {
            packages: id,
        },
    });

    return res.status(NO_CONTENT).json({});
  } catch (err) {
    return next(err);
  }
};

const getAllPackages = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const isFreelancer = await Freelancer.findById(req.user.id);
    const isClient = await Client.findById(req.user.id);

    const userInfo = isFreelancer || isClient;

    if (userInfo.userType === userTypes.CLIENT) return res.status(FORBIDDEN).json({});

    // Get all freelancer packages
    const { packages } = await Freelancer.findById(userInfo._id, 'packages');

    // Match all these packages in our database
    const allPackages = await Package.find({ _id: { $in: packages } });

    return res.status(OK).json(allPackages);
  } catch (err) {
    return next(err);
  }
};

export {
  createPackage,
  getPackage,
  updatePackage,
  removePackage,
  getAllPackages,
};
