import express from "express";

import {
  createClient,
  getClient,
  addToVisitList,
  search
} from "../controllers/ClientController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authHandler from "../middlewares/authHandler.js";

const ClientRouter = express.Router();

ClientRouter.route("/").post(createClient, errorHandler);
ClientRouter.route("/search/freelancers").get(authHandler, search, errorHandler);
ClientRouter.route("/:id").get(getClient, errorHandler);
ClientRouter.route("/visit").post(authHandler, addToVisitList, errorHandler);

export default ClientRouter;
