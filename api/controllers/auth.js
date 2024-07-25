const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/error');

const signup = async (req, res, next) => {
    const { email, username, password } = req.body;

    if (
        !username ||
        !email ||
        !password ||
        username === '' ||
        email === '' ||
        password === ''
    ) {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = await User.create({ email, username, password: hashedPassword });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('access_token', token, { httpOnly: true });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}


module.exports = {signup};