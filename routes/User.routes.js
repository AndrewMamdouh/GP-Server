import express from "express";

import {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers
} from "../controllers/User.controller.js";

const UserRouter = express.Router();

UserRouter.route("/").post(createUser);
UserRouter.route("/:uid").get(getUser);
UserRouter.route("/:uid").patch(updateUser);
UserRouter.route("/:uid").delete(deleteUser);
UserRouter.route("/").get(getAllUsers);

export default UserRouter;