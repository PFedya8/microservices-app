const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
