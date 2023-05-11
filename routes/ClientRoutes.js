import express from "express";

import {
  createClient,
  getClient,
} from "../controllers/ClientController.js";

const ClientRouter = express.Router();

ClientRouter.route("/").post(createClient);
ClientRouter.route("/:id").get(getClient);

export default ClientRouter;
