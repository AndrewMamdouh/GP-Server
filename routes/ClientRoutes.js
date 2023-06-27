import express from "express";

import {
  createClient,
  getClient,
  addToVisitList,
  addToFavList,
  removeFromFavList,
  search
} from "../controllers/ClientController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authHandler from "../middlewares/authHandler.js";

const ClientRouter = express.Router();

ClientRouter.route("/").post(createClient, errorHandler);
ClientRouter.route("/search/freelancers").get(authHandler, search, errorHandler);
ClientRouter.route("/:id").get(getClient, errorHandler);
ClientRouter.route("/visit").post(authHandler, addToVisitList, errorHandler);
ClientRouter.route("/fav").post(authHandler, addToFavList, errorHandler);
ClientRouter.route("/fav/:id").delete(authHandler, removeFromFavList, errorHandler);

export default ClientRouter;
