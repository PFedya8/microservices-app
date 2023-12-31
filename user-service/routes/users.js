const express = require('express');
const router = express.Router();
const User = require('../Models/User.js');
getUser = async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({message: 'User not found'});
        }

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.user = user;
    next();
}

router.get('/user-test', async (req, res) => {
    res.json({ message: 'user-service message' });
});

// Получение всех пользователей
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получение пользователя по id
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Создание пользователя
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Удаление пользователя
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'Deleted This User' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Обновление пользователя
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.userName;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    if (req.body.phone != null) {
        res.user.phone = req.body.phone;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;