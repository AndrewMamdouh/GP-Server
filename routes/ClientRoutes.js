import express from "express";

import {
  createClient,
  getClient,
  updateClient,
  deleteClient,
  getAllClients,
} from "../controllers/ClientController.js";

const ClientRouter = express.Router();

ClientRouter.route("/").post(createClient);
ClientRouter.route("/:uid").get(getClient);
ClientRouter.route("/:uid").patch(updateClient);
ClientRouter.route("/:uid").delete(deleteClient);
ClientRouter.route("/").get(getAllClients);

export default ClientRouter;
