import { default as User } from "../mongodb/models/User.js";

const createUser = async (req, res) => {
    res.json('User Created!');
}
const getUser = async (req, res) => {
    res.json('User Returned!');
}
const updateUser = async (req, res) => {
    res.json('User Updated!');
}
const deleteUser = async (req, res) => {
    res.json('User Deleted!');
}
const getAllUsers = async (req, res) => {
    res.json('All Users Returned!');
}

export { createUser, getUser, updateUser, deleteUser, getAllUsers };