const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/orders', {
mongoose.connect('mongodb://orderdb:27017/orders', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);

const port = 3001;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

