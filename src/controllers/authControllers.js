const authServices = require('../services/authServices');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GG_CLIENT_ID);

const authControllers = {
    register: async (req, res) => {
        const { name, email, address, phoneNumber, password, role } = req.body;

        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const result = await authServices.register({ name, email, address, phoneNumber, password, role });
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    login: async (req, res) => {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ error: 'Phone number and password are required' });
        }

        try {
            const result = await authServices.login(phoneNumber, password);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    GoogleLogin: async (req, res) => {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: 'Credential is required' });
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GG_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const { email, name } = payload;
            const data = {
                email,
                name,
            };
            res.status(200).json(data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },
};

module.exports = authControllers;
