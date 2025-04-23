const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authServices = {
    register: async (data) => {
        try {
            const { name, email, address, phoneNumber, password, role } = data;

            // Bước 1: Chèn vào bảng user
            const [rows] = await pool.query(
                'INSERT INTO user (name, email, address, phoneNumber, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, address, phoneNumber, role],
            );

            const userId = rows.insertId; // Lấy ID của user vừa tạo

            const hash = bcrypt.hashSync(password, 10);

            // Bước 2: Chèn vào bảng auth_credentials (sau khi bước 1 hoàn thành)
            await pool.query('INSERT INTO auth_credentials (user_id, phoneNumber , password) VALUES (?,?, ?)', [
                userId,
                phoneNumber,
                hash,
            ]);

            // Thành công
            return {
                status: 200,
                message: 'Đăng ký thành công',
            };
        } catch (error) {
            console.error('Database query error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return { status: 409, message: 'Số điện thoại này đã được đăng ký. Vui lòng dùng số khác.' };
            }

            return { status: 500, message: 'Internal Server Error' };
        }
    },

    login: async (phoneNumber, password) => {
        try {
            const sql = 'SELECT * FROM auth_credentials WHERE phoneNumber = ?';

            const [rows, fields] = await pool.query(sql, [phoneNumber]);
            if (rows.length === 0) {
                return { status: 401, message: 'Invalid phoneNumber or password' };
            }

            const userAccount = rows[0];
            const isPasswordValid = bcrypt.compareSync(password, userAccount.password);
            if (!isPasswordValid) {
                return { status: 401, message: 'Invalid phoneNumber or password' };
            }

            const [userInfor] = await pool.query('select id, name, role from user where id = ?', [userAccount.user_id]);

            if (!userInfor || userInfor.length === 0) {
                return { status: 404, message: 'User information not found' };
            }

            const payload = { phoneNumber, userInfor: userInfor[0] };
            const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });

            return {
                status: 200,
                data: {
                    access_token,
                    user: { ...userInfor[0], phoneNumber },
                },
            };
        } catch (error) {
            console.error('Database query error:', error);

            return { status: 500, message: 'Internal Server Error' };
        }
    },
};

module.exports = authServices;
