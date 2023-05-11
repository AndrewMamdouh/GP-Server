import express from "express";

import {
  createClient,
  getClient,
} from "../controllers/ClientController.js";
import errorHandler from "../middlewares/errorHandler.js";

const ClientRouter = express.Router();

ClientRouter.route("/").post(createClient, errorHandler);
ClientRouter.route("/:id").get(getClient, errorHandler);

export default ClientRouter;
