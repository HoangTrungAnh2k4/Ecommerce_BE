const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserModel = require('../models/userModel');

const authServices = {
    register: async (data) => {
        try {
            const { username, phoneNumber, password } = data;
            const hashedPassword = bcrypt.hashSync(password, 8);
            const result = await UserModel.create({
                username,
                phoneNumber,
                password: hashedPassword,
            });

            return {
                status: 200,
                message: 'Đăng ký tài khoản thành công' + result,
            };
        } catch (error) {
            console.error('Database query error:', error);
            if (error.code == 11000) {
                return { status: 409, message: 'Số điện thoại này đã được đăng ký. Vui lòng dùng số khác.' };
            }

            return { status: 500, message: 'Internal Server Error' };
        }
    },

    login: async (phoneNumber, password) => {
        try {
            const userInfor = await UserModel.findOne({ phoneNumber });
            if (!userInfor) {
                return { status: 404, message: 'Số điện thoại hoặc mật khẩu không chính xác!' };
            }

            const isPasswordValid = bcrypt.compareSync(password, userInfor.password);
            if (!isPasswordValid) {
                return { status: 404, message: 'Số điện thoại hoặc mật khẩu không chính xác!' };
            }

            const payload = { phoneNumber, username: userInfor.username, role: userInfor.role };
            const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });

            return {
                status: 200,
                data: {
                    access_token,
                    user: { username: userInfor.username, role: userInfor.role, phoneNumber },
                },
            };
        } catch (error) {
            console.error('Database query error:', error);

            return { status: 500, message: 'Internal Server Error' };
        }
    },
};

module.exports = authServices;
