const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// have to connect to the productdb database in the product-service container
// if you want to connect to the database in the host machine, you can use the following line:

// mongoose.connect('mongodb://localhost:27017/products', {
mongoose.connect('mongodb://productdb:27017/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

const port = 3003;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});