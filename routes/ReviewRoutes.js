import express from "express";
import { createReview, updateReview, deleteReview, getAllReviews }from "../controllers/ReviewController.js";
import authHandler from "../middlewares/authHandler.js";
import errorHandler from "../middlewares/errorHandler.js";

const ReviewRouter = express.Router();

ReviewRouter.route("/").post(authHandler, createReview, errorHandler);
ReviewRouter.route("/:id").patch(authHandler, updateReview, errorHandler);
ReviewRouter.route("/:id").delete(authHandler, deleteReview, errorHandler);
ReviewRouter.route("/:id").get(getAllReviews, errorHandler);

export default ReviewRouter;
