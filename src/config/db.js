// db/mongoose.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

const CONNECT_DB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGODB_URI);

        isConnected = true;
        console.log('Connected to MongoDB with Mongoose');
    } catch (error) {
        console.error('Error connecting to MongoDB with Mongoose:', error);
        throw error;
    }
};

module.exports = {
    CONNECT_DB,
    mongoose,
};
