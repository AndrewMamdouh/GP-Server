import { default as Client } from '../mongodb/models/Client.js'

const createClient = async (req, res) => {
    res.json('Client Created!');
}
const getClient = async (req, res) => {
    res.json('Client Returned!');
}
const updateClient = async (req, res) => {
    res.json('Client Updated!');
}
const deleteClient = async (req, res) => {
    res.json('Client Deleted!');
}
const getAllClients = async (req, res) => {
    res.json('All Clients Returned!');
}

export { createClient, getClient, updateClient, deleteClient, getAllClients };