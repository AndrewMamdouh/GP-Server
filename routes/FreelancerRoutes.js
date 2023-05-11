import express from "express";

import {
  createFreelancer,
  getFreelancer,
} from "../controllers/FreelancerController.js";
import errorHandler from "../middlewares/errorHandler.js";

const FreelancerRouter = express.Router();

FreelancerRouter.route("/").post(createFreelancer, errorHandler);
FreelancerRouter.route("/:id").get(getFreelancer, errorHandler);

export default FreelancerRouter;
