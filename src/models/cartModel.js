const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        list_product: [
            {
                product_id: {
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
    },
    { timestamps: true },
);

module.exports = mongoose.model('Cart', cartSchema);
