import express from "express";

import {
  createUser,
  getProfile,
  updateProfile
} from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authHandler from "../middlewares/authHandler.js";

const UserRouter = express.Router();

UserRouter.route("/").post(createUser, errorHandler);
UserRouter.route("/me").get(authHandler, getProfile, errorHandler);
UserRouter.route("/me").patch(authHandler, updateProfile, errorHandler);


export default UserRouter;
