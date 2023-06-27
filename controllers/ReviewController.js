import { default as Review } from '../mongodb/models/Review.js';
import { default as Freelancer } from "../mongodb/models/Freelancer.js";
import { default as Client } from "../mongodb/models/Client.js";
import AppError from '../constants/AppError.js';
import { isValidObjectId } from "mongoose";
import { errorEnum, httpResponseCodes } from '../constants/errorCodes.js';
import CreateReviewService from '../services/CreateReviewService.js';

const { INVALID_ID, REVIEW_EXIST } = errorEnum; 
const { CREATED, OK, NO_CONTENT } = httpResponseCodes;

const createReview = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);
    const isClient = await Client.findById(userId);

    if (isFreelancer) return res.status(FORBIDDEN).json({});
    if (!isClient) return res.status(NOT_FOUND).json({});
    
    const from = isClient._id;

    const reviewExists = await Review.findOne({ from });

    // Check if client reviewed freelancer before
    if (reviewExists) throw new AppError(REVIEW_EXIST);
    
    const { content, to } = req.body;

    const validReviewInfo = CreateReviewService({ content });

    // Check if id is valid
    if(!isValidObjectId(to)) throw new AppError(INVALID_ID);

    // Create review in our database
    const newReview = await Review.create({ ...validReviewInfo, from, to });

    // Add review to freelancer
    await Freelancer.findByIdAndUpdate(to, {
      $addToSet: { reviews: newReview._id }
    })
    
    res.status(CREATED).json({});
    
  } catch (err) {
    return next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);
    const isClient = await Client.findById(userId);

    if (isFreelancer) return res.status(FORBIDDEN).json({});
    if (!isClient) return res.status(NOT_FOUND).json({});

    // Get review ID
    const id = req.params.id;

    // Check if id is valid
    if(!isValidObjectId(id)) throw new AppError(INVALID_ID);

    const isReviewExist = await Review.findById(id);

    if(!isReviewExist) return res.status(NOT_FOUND).json({});

    // Get review updated content
    const { content } = req.body;

    const validReviewInfo = CreateReviewService({ content });

    // Update review in our database
    await Review.findByIdAndUpdate(id, { ...validReviewInfo })

    return res.status(NO_CONTENT).json({});
    
  } catch (err) {
    return next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    if (!req.user) return res;

    const { id: userId } = req.user;

    const isFreelancer = await Freelancer.findById(userId);
    const isClient = await Client.findById(userId);

    if (isFreelancer) return res.status(FORBIDDEN).json({});
    if (!isClient) return res.status(NOT_FOUND).json({});

    // Get review ID
    const id = req.params.id;

    // Check if id is valid
    if(!isValidObjectId(id)) throw new AppError(INVALID_ID);

    const isReviewExist = await Review.findById(id);

    if(!isReviewExist) return res.status(NOT_FOUND).json({});

    // delete review from our database
    await Review.findByIdAndDelete(id)

    return res.status(NO_CONTENT).send();
    
  } catch (err) {
    return next(err);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    // Get freelancer ID
    const id = req.params.id;

    // Check if id is valid
    if(!isValidObjectId(id)) throw new AppError(INVALID_ID);

    const isFreelancer = await Freelancer.findById(id);
    const isClient = await Client.findById(id);

    if (isClient) return res.status(FORBIDDEN).json({});
    if (!isFreelancer) return res.status(NOT_FOUND).json({});

    const reviews = await Review.find({ to: id }, {
      _id: false,
      __v: false
    }).sort({ date: -1 });

    res.status(OK).json(reviews);
  } catch (err) {
    return next(err);
  }
};

export { createReview, updateReview, deleteReview, getAllReviews }