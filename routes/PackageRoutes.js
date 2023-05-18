import express from "express";

import {
  createPackage,
  getPackage,
  updatePackage,
  removePackage,
  getAllPackages,
} from "../controllers/PackageController.js";

import errorHandler from "../middlewares/errorHandler.js";
import authHandler from "../middlewares/authHandler.js";

const PackageRouter = express.Router();

PackageRouter.route("/").post(authHandler, createPackage, errorHandler);
PackageRouter.route("/:id").get(authHandler, getPackage, errorHandler);
PackageRouter.route("/:id").patch(authHandler, updatePackage, errorHandler);
PackageRouter.route("/:id").delete(authHandler, removePackage, errorHandler);
PackageRouter.route("/").get(authHandler, getAllPackages, errorHandler);


export default PackageRouter;
