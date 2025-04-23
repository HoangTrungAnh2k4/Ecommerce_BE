const adminServices = require('../services/adminServices');

const adminControllers = {
    Type: ['pc', 'laptop', 'monitor', 'ssd', 'cpu', 'gpu', 'mainboard'],

    addProduct: async (req, res) => {
        const { name, type, sold_quantity, price, discount, urlImage, best_seller, stock_quantity = 0 } = req.body;

        if (!type || !adminControllers.Type.includes(type)) {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

        if (
            !name ||
            !type ||
            sold_quantity === undefined ||
            price === undefined ||
            discount === undefined ||
            !urlImage ||
            best_seller === undefined
        ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const result = await adminServices.addProduct({
                name,
                type,
                sold_quantity,
                price,
                discount,
                urlImage,
                best_seller,
                stock_quantity,
            });
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        try {
            const result = await adminServices.deleteProduct(id);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    deleteRate: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        try {
            const result = await adminServices.deleteRate(id);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const result = await adminServices.getAllOrders();
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getMonthlyStats: async (req, res) => {
        try {
            const result = await adminServices.getMonthlyStats();
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    updateEquipment: async (req, res) => {
        
    }
};

module.exports = adminControllers;
