import { default as Freelancer } from "../mongodb/models/Freelancer.js"

const createFreelancer = async (req, res) => {
    res.json('Freelancer Created!');
}
const getFreelancer = async (req, res) => {
    res.json('Freelancer Returned!');
}
const updateFreelancer = async (req, res) => {
    res.json('Freelancer Updated!');
}
const deleteFreelancer = async (req, res) => {
    res.json('Freelancer Deleted!');
}
const getAllFreelancers = async (req, res) => {
    res.json('All Freelancers Returned!');
}

export { createFreelancer, getFreelancer, updateFreelancer, deleteFreelancer, getAllFreelancers };