const express = require('express');
const router = express.Router();
const Order = require('../Models/Order.js');


getOrder = async (req, res, next) => {
    try {
        order = await Order.findById(req.params.id);
        if (order == null) {
            return res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.order = order;
    next();
}

const amqp = require('amqplib');

router.get('/rabbitmq-test', async (req, res) => {
    try {
        // Connect to RabbitMQ
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        // Declare the queue
        const queue = 'hello';
        await channel.assertQueue(queue, { durable: false });

        // Send the message
        const message = 'Hello, World!';
        channel.sendToQueue(queue, Buffer.from(message));

        console.log(`Message sent to queue: ${message}`);

        // Close the connection
        setTimeout(() => {
            connection.close();
            console.log('Connection closed');
        }, 500);

        res.status(200).send('Message sent to RabbitMQ');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending message to RabbitMQ');
    }
}); 


//test order-service message
router.get('/order-qw', async (req, res) => {
    try {
        res.send('order-service');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получение всех заказов
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получение заказа по id
router.get('/:id', getOrder, (req, res) => {
    res.json(res.order);
});

// Создание заказа
router.post('/', async (req, res) => {
    const order = new Order({
        customerName: req.body.customerName,
        totalAmount: req.body.totalAmount,
        status: req.body.status,
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Удаление заказа
router.delete('/:id', getOrder, async (req, res) => {
    try {
        await res.order.remove();
        res.json({ message: 'Deleted order' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
} );




module.exports = router;


