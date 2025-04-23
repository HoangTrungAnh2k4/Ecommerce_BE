const userService = require('../services/userServices');

const userControllers = {
    Type: ['pc', 'laptop', 'monitor', 'ssd', 'cpu', 'gpu', 'mainboard'],

    test: async (req, res) => {
        try {
            const result = await userService.test();
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getListEquipmentByType: async (req, res) => {
        try {
            const { type } = req.query;

            if (!type || !userControllers.Type.includes(type)) {
                return res.status(400).json({ error: 'Invalid type parameter' });
            }

            const result = await userService.getListEquipmentByType(type);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getListBestSeller: async (req, res) => {
        try {
            const { type } = req.query;

            if (!type || !userControllers.Type.includes(type)) {
                return res.status(400).json({ error: 'Invalid type parameter' });
            }

            const result = await userService.getListBestSeller(type);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getUserInfor: async (req, res) => {
        console.log(req.user);

        try {
            res.status(200).json(req.user);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    postRate: async (req, res) => {
        try {
            const { value, comment, equipment_id } = req.body;
            const user = {
                id: req.user.userInfor.id,
                name: req.user.userInfor.name,
            };
            const rate = {
                value: parseInt(value),
                comment: comment,
                equipment_id: parseInt(equipment_id),
            };

            const result = await userService.postRate(user, rate);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getRate: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) return res.status(400).json({ error: 'Invalid id parameter' });

            const result = await userService.getRate(id);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getEquipmentDetail: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) return res.status(400).json({ error: 'Invalid id parameter' });

            const result = await userService.getEquipmentDetail(id);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    addToCart: async (req, res) => {
        try {
            const userId = req.user.userInfor.id;
            const { equipmentId, quantity } = req.body;
            const equipment = {
                id: parseInt(equipmentId),
                quantity: parseInt(quantity),
            };

            if (!userId) return res.status(400).json({ error: 'Invalid id user_id' });

            const result = await userService.addToCart(userId, equipment);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getCart: async (req, res) => {
        try {
            const userId = req.user.userInfor.id;

            if (!userId) return res.status(400).json({ error: 'Invalid id user_id' });

            const result = await userService.getCart(userId);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    deleteItemCart: async (req, res) => {
        try {
            const equipmentId = req.params.id;
            const userId = req.user.userInfor.id;

            if (!userId) return res.status(400).json({ error: 'Invalid id user_id' });
            if (!equipmentId) return res.status(400).json({ error: 'Invalid id equipment_id' });

            const result = await userService.deleteItemCart(userId, equipmentId);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    addNewOrder: async (req, res) => {
        try {
            const { listEquipment } = req.body;

            const userId = req.user.userInfor.id;

            if (!userId) return res.status(400).json({ error: 'Invalid id user_id' });
            if (!listEquipment) return res.status(400).json({ error: 'Invalid id listEquipment' });

            const result = await userService.addNewOrder(userId, listEquipment);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    getOrder: async (req, res) => {
        try {
            const userId = req.user.userInfor.id;

            if (!userId) return res.status(400).json({ error: 'Invalid id user_id' });

            const result = await userService.getOrder(userId);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    search: async (req, res) => {
        try {
            const search = req.query.search || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await userService.search(search, page, limit);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },

    updateEquipment: async (req, res) => {
        try {
            const { listEquipment } = req.body;

            const result = await userService.updateEquipment(listEquipment);
            res.status(result.status).json(result.message ? { message: result.message } : result.data);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        }
    },
};

module.exports = userControllers;
