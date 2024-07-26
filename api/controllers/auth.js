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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, { httpOnly: true });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email ||!password) {
        next(errorHandler(404, 'Email and password are required'));
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(400, 'Invalid credentials'));
        }

        const isMatch = bcryptjs.compareSync(password, user.password);

        if (!isMatch) {
            return next(errorHandler(401, 'Invalid credentials'));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, { httpOnly: true });

        const { password: pass, ...rest } = user._doc

        res.status(200).json(rest);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const googleAuth = async (req, res, next) => {
    const { name, email, photoURL } = req.body

    const user = await User.findOne({ email})

    try {
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.cookie('access_token', token, { httpOnly: true });

            const { password: pass, ...rest } = user._doc
            res.status(200).json(rest)
        } else {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

            const newUser = await User.create({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: photoURL
            })

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc
    
            res.cookie('access_token', token, { httpOnly: true });
    
            res.status(200).json(rest)
        }        
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

module.exports = { signup, signin, googleAuth };