import { default as Client } from '../mongodb/models/Client.js'

const createClient = async (req, res) => {
    res.json('Client Created!');
}

const getClient = async (req, res) => {
    res.json('Client Returned!');
}

export { createClient, getClient };