const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


mongoose.connect('mongodb://userdb:27017/users', {
// mongoose.connect('mongodb://localhost:27017/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const port = 3002;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});