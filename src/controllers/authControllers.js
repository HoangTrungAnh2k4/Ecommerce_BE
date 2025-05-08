const authServices = require('../services/authServices');

const authControllers = {
    register: async (req, res) => {
        const { username, phoneNumber, password } = req.body;

        if (!username || !phoneNumber || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const result = await authServices.register({ username, phoneNumber, password });
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
};

module.exports = authControllers;
