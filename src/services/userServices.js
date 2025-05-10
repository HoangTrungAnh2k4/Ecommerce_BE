const equipmentModel = require('../models/equipmentModel');
const evaluationModel = require('../models/evaluationModel');
const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');

const userService = {
    test: async () => {
        try {
            const [results] = await pool.query("SELECT * FROM equipment WHERE type = 'ssd'");

            if (results.length === 0) {
                return { status: 404, message: 'Data not found' };
            }

            return { status: 200, data: results };
        } catch (err) {
            console.error('Error:', err);
            if (err.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    getListEquipmentByType: async (type) => {
        try {
            const equipmentInfor = await equipmentModel.find({ type: type }).sort({ sold_quantity: -1 });

            if (equipmentInfor.length === 0) {
                return { status: 404, message: 'Data not found' };
            }

            return { status: 200, data: equipmentInfor };
        } catch (err) {
            console.error('Database query error:', error);
            if (error.code == 11000) {
                return { status: 409, message: 'Sản phẩm này đã tồn tại' };
            }

            return { status: 500, message: 'Internal Server Error' };
        }
    },

    getListBestSeller: async (type) => {
        try {
            const listEquipment = await equipmentModel
                .find({ type: type, best_seller: true })
                .sort({ sold_quantity: -1 })
                .limit(10);
            if (listEquipment.length === 0) {
                return { status: 404, message: 'Data not found' };
            }

            return { status: 200, data: listEquipment };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    postRate: async (user, rate) => {
        try {
            const results = await evaluationModel.create({
                userID: user.id,
                userName: user.name,
                equipment: rate.equipmentId,
                value: rate.value,
                comment: rate.comment,
            });

            if (results.length === 0) {
                return { status: 404, message: 'Rate fail' };
            }

            return { status: 200, message: 'Rate  successfully' };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    getRate: async (id) => {
        try {
            const results = await evaluationModel
                .find({ equipment: id })
                .populate('userID', 'username')
                .populate('equipment', 'name')
                .sort({ updatedAt: -1 });

            if (results.length === 0) {
                return { status: 404, message: 'Rate not found' };
            }

            return { status: 200, data: results };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    getEquipmentDetail: async (id) => {
        try {
            const results = await equipmentModel.findById(id);

            if (!results) {
                return { status: 404, message: 'Equipment not found' };
            }

            return { status: 200, data: results };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    addToCart: async (userId, equipment) => {
        try {
            let cart = await cartModel.findOne({ user_id: userId });

            if (!cart) {
                cart = await cartModel.create({
                    user_id: userId,
                    list_product: [],
                });
                if (!cart) {
                    return { status: 500, message: 'Create cart failed' };
                }
            }

            const existingItem = cart.list_product.find(
                (item) => item.product_id.toString() === equipment.id.toString(),
            );

            if (existingItem) {
                existingItem.quantity += equipment.quantity;
            } else {
                cart.list_product.push({
                    product_id: equipment.id,
                    quantity: equipment.quantity,
                });
            }

            await cart.save(); // Lưu thay đổi

            return { status: 200, message: 'Add to cart successfully' };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else if (error.code === 'ER_DUP_ENTRY') {
                return { status: 409, message: 'Duplicate entry' };
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    getCart: async (userId) => {
        try {
            const result = await cartModel.findOne({ user_id: userId });
            if (!result) {
                return { status: 404, message: 'Cart not found' };
            }

            return { status: 200, data: result.list_product };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    deleteItemCart: async (userId, equipmentId) => {
        try {
            const cartItem = await cartModel.findOne({ user_id: userId });
            if (!cartItem) {
                return { status: 404, message: 'Cart not found' };
            }

            const itemIndex = cartItem.list_product.findIndex(
                (item) => item.product_id.toString() === equipmentId.toString(),
            );
            if (itemIndex === -1) {
                return { status: 404, message: 'Item not found in cart' };
            }

            cartItem.list_product.splice(itemIndex, 1); // Xóa sản phẩm khỏi giỏ hàng
            await cartItem.save(); // Lưu thay đổi

            return { status: 200, message: 'Delete item successfully' };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else if (error.code === 'ER_DUP_ENTRY') {
                return { status: 409, message: 'Duplicate entry' };
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    addNewOrder: async (userId, listEquipment) => {
        if (!userId) {
            return { status: 400, message: 'Invalid userId' };
        }
        console.log('userId', userId);

        try {
            const result = await orderModel.findOne({ user_id: userId });

            const listEquipIds = listEquipment.map((eq) => {
                return {
                    equipment_id: eq.equipmentId,
                    quantity: eq.quantity,
                };
            });

            console.log('result', result);

            if (!result) {
                console.log('Creating new order');

                const newOrder = await orderModel.create({
                    user_id: userId,
                    list_order: [
                        {
                            equipmentList: listEquipIds,
                        },
                    ],
                });

                if (!newOrder) {
                    return { status: 500, message: 'Create order failed' };
                }
            } else {
                await orderModel.updateOne(
                    { user_id: userId },
                    {
                        $push: {
                            list_order: {
                                equipmentList: listEquipIds,
                            },
                        },
                    },
                    { runValidators: true },
                );
            }

            return { status: 200, message: 'Add new order successfully' };
        } catch (error) {
            console.error('Error in addNewOrder:', error);
            return { status: 500, message: 'Server error', error: error.message };
        }
    },

    getOrder: async (userId) => {
        try {
            const results = await orderModel
                .findOne({ user_id: userId })
                .populate('list_order.equipmentList.equipment_id', 'name price sold_quantity urlImage')
                .sort({ 'list_order.date': 1 });

            if (!results) {
                return { status: 404, message: 'Order not found' };
            }

            if (results.list_order) {
                results.list_order.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            return { status: 200, data: results.list_order };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else if (error.code === 'ER_DUP_ENTRY') {
                return { status: 409, message: 'Duplicate entry' };
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    search: async (search, page = 1, limit = 10) => {
        try {
            const query = {
                name: { $regex: search, $options: 'i' }, // tìm gần đúng, không phân biệt hoa thường
            };

            const skip = (page - 1) * limit;

            const [equipment, total] = await Promise.all([
                equipmentModel.find(query).skip(skip).limit(limit),
                equipmentModel.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                status: 200,
                data: {
                    equipment,
                    total,
                    totalPages,
                },
            };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },

    updateEquipment: async (listEquipment) => {
        try {
            const results = await Promise.all(
                listEquipment.map((item) =>
                    equipmentModel.updateOne(
                        { _id: item.equipmentId },
                        {
                            $inc: {
                                sold_quantity: item.quantity,
                                stock_quantity: -item.quantity,
                            },
                        },
                    ),
                ),
            );

            const failed = results.filter((res) => res.matchedCount === 0);
            if (failed.length > 0) {
                return {
                    status: 400,
                    message: 'Một số thiết bị không tồn tại hoặc không đủ hàng',
                };
            }

            return { status: 200, message: 'Update equipment successfully' };
        } catch (error) {
            console.error('Error:', error);
            if (error.code === 'ER_NO_SUCH_TABLE') {
                throw new Error('TABLE_NOT_FOUND');
            } else {
                throw new Error('DATABASE_ERROR');
            }
        }
    },
};

module.exports = userService;
