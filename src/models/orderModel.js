const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    list_order: [
        {
            equipmentList: [
                {
                    equipment_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Equipment',
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                },
            ],

            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = mongoose.model('Order', orderSchema);
