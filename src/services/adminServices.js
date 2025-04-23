const pool = require('../config/db');

const adminServices = {
    addProduct: async (data) => {
        try {
            const { name, type, sold_quantity, price, discount, urlImage, best_seller, stock_quantity } = data;

            const sql1 =
                'INSERT INTO equipment (name, type, sold_quantity, price, discount,best_seller, stock_quantity, image_url) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';
            const params1 = [name, type, sold_quantity, price, discount, best_seller, stock_quantity, urlImage];

            // thêm dữ liệu vào bảng equipment
            const [result1] = await pool.query(sql1, params1);
            const equipmentId = result1.insertId; // Lấy ID của thiết bị vừa tạo

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
            const sql = 'DELETE FROM equipment WHERE id = ?';
            const params = [id];

            // xóa thiết bị trong bảng equipment
            await pool.query(sql, params);

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
            const sql = 'DELETE FROM evaluation WHERE id = ?';
            await pool.query(sql, [id]);
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
            const sql = `
                SELECT od.*, oc.user_id, oc.date
                FROM order_detail od
                JOIN order_common oc ON od.order_id = oc.order_id
                ORDER BY od.order_id DESC
            `;

            const [results] = await pool.query(sql);

            if (results.length === 0) {
                return { status: 404, message: 'No orders found' };
            }

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
            const sql = `
                SELECT 
                    DATE_FORMAT(oc.date, '%Y-%m') AS month,
                    COUNT(DISTINCT oc.order_id) AS total_orders,
                    SUM(od.quantity * e.price * (1 - e.discount / 100)) AS total_revenue
                FROM order_common oc
                JOIN order_detail od ON oc.order_id = od.order_id
                JOIN equipment e ON od.equipment_id = e.id
                GROUP BY month
                ORDER BY month DESC;

            `;

            const [results] = await pool.query(sql);

            return { status: 200, data: results };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('DATABASE_ERROR');
        }
    },
};

module.exports = adminServices;
