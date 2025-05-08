const mongoose = require('mongoose');
const { validate } = require('./userModel');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 100;
            },
            message: 'Discount must be between 0 and 100',
        },
    },
    stock_quantity: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'Stock quantity must be a positive number',
        },
        default: 0,
    },
    best_seller: {
        type: Boolean,
        default: false,
    },
    sold_quantity: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'Sold quantity must be a positive number',
        },
    },
});

module.exports = mongoose.model('Equipment', equipmentSchema);
