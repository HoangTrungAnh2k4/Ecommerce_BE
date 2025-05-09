const EquipmentModel = require('../models/equipmentModel');
const EvaluationModel = require('../models/evaluationModel');

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
            const result = await EvaluationModel.deleteOne({ _id: id });

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
            return { status: 200, data: results };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('DATABASE_ERROR');
        }
    },
};

module.exports = adminServices;
