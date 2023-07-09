const Product = require('../Models/Product');
const router = require('express').Router();

getProduct = async (req, res, next) => {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({message: 'Product not found'});
        }

    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.product = product;
    next();
}


// Получение всех продуктов
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получение продукта по id
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});

// Создание продукта
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Изменение продукта
router.patch('/:id', getProduct, async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }
    if (req.body.price != null) {
        res.product.price = req.body.price;
    }
    if (req.body.description != null) {
        res.product.description = req.body.description;
    }
    try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Удаление продукта
router.delete('/:id', getProduct, async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await Product.findByIdAndDelete(productId);
        res.json({ message: `Product ${productId} has been deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


const amqp = require('amqplib');

async function listenToQueue() {
  try {
    // Connect to RabbitMQ

    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    // Declare the queue
    const queue = 'hello';
    await channel.assertQueue(queue, { durable: false });

    // Consume messages from the queue
    channel.consume(queue, (message) => {
      if (message !== null) {
        console.log(`Received message: ${message.content.toString()}`);
        channel.ack(message); // Acknowledge the message
      }
    });

    console.log('Listening for messages...');

    // Close the connection
    process.on('SIGINT', () => {
      connection.close();
      console.log('Connection closed');
    });
  } catch (error) {
    console.error(error);
  }
}

listenToQueue();





module.exports = router;


