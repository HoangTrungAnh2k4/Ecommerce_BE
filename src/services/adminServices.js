const equipmentModel = require('../models/equipmentModel');
const evaluationModel = require('../models/evaluationModel');
const orderModel = require('../models/orderModel');

const adminServices = {
    addProduct: async (data) => {
        try {
            const { name, type, sold_quantity, price, discount, urlImage, best_seller, stock_quantity } = data;

            const newEquipment = await EquipmentModel.create({
                name,
                type,
                sold_quantity,
                price,
                discount,
                urlImage,
                best_seller,
                stock_quantity,
            });

            if (newEquipment?.length === 0) {
                return { status: 400, message: 'Thêm thiết bị không thành công' };
            }

            return {
                status: 200,
                message: 'Thêm thiết bị thành công',
            };
        } catch (error) {
            console.error('Database query error:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                return { status: 400, message: 'Thiết bị này đã tồn tại. Vui lòng dùng tên khác.' };
            }

            return { status: 500, message: 'Internal Server Error' };
        }
    },

    deleteProduct: async (id) => {
        try {
            const result = await equipmentModel.deleteOne({ _id: id });

            if (result.deletedCount === 0) {
                return { status: 404, message: 'Thiết bị không tồn tại' };
            }

            return {
                status: 200,
                message: 'Xóa thiết bị thành công',
            };
        } catch (error) {
            console.error('Database query error:', error);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    deleteRate: async (id) => {
        try {
            const result = await evaluationModel.deleteOne({ _id: id });

            if (result.deletedCount === 0) {
                return { status: 404, message: 'Đánh giá không tồn tại' };
            }

            return {
                status: 200,
                message: 'Xóa đánh giá thành công',
            };
        } catch (error) {
            console.error('Database query error:', error);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    getAllOrders: async () => {
        try {
            return { status: 200, data: results };
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

    getMonthlyStats: async () => {
        try {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // đầu tháng cách đây 11 tháng

            const results = await orderModel.aggregate([
                // Bước 1: chỉ lấy các list_order trong 12 tháng gần nhất
                {
                    $project: {
                        list_order: {
                            $filter: {
                                input: '$list_order',
                                as: 'item',
                                cond: { $gte: ['$$item.date', startDate] },
                            },
                        },
                    },
                },
                { $unwind: '$list_order' },
                { $unwind: '$list_order.equipmentList' },
                {
                    $lookup: {
                        from: 'equipment',
                        localField: 'list_order.equipmentList.equipment_id',
                        foreignField: '_id',
                        as: 'equipment_info',
                    },
                },
                { $unwind: '$equipment_info' },
                {
                    $addFields: {
                        order_month: {
                            $dateToString: { format: '%Y-%m', date: '$list_order.date' },
                        },
                        revenue: {
                            $multiply: [
                                '$list_order.equipmentList.quantity',
                                {
                                    $multiply: [
                                        '$equipment_info.price',
                                        { $divide: [{ $subtract: [100, '$equipment_info.discount'] }, 100] },
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            month: '$order_month',
                            orderId: '$_id',
                        },
                        monthlyRevenuePerOrder: { $sum: '$revenue' },
                    },
                },
                {
                    $group: {
                        _id: '$_id.month',
                        totalRevenue: { $sum: '$monthlyRevenuePerOrder' },
                        orderCount: { $sum: 1 },
                    },
                },
                { $sort: { _id: -1 } }, // tăng dần
            ]);

            if (results.length === 0) {
                return { status: 404, message: 'No data found' };
            }

            return { status: 200, data: results };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('DATABASE_ERROR');
        }
    },
};

module.exports = adminServices;
