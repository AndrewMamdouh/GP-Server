import express from "express";

import {
    createFreelancer,
    getFreelancer,
    updateFreelancer,
    deleteFreelancer,
    getAllFreelancers
} from "../controllers/Freelancer.controller.js";

const FreelancerRouter = express.Router();

FreelancerRouter.route("/").post(createFreelancer);
FreelancerRouter.route("/:uid").get(getFreelancer);
FreelancerRouter.route("/:uid").patch(updateFreelancer);
FreelancerRouter.route("/:uid").delete(deleteFreelancer);
FreelancerRouter.route("/").get(getAllFreelancers);

export default FreelancerRouter;