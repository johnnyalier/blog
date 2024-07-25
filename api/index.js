const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const path = require("path")
const cors = require("cors");

const authRoutes = require('./routes/auth.js');

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use(cors());

app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
})

app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to sudd-estate database')
    app.listen(PORT, () => {
        console.log(`Server listening at port ${PORT}`);
    })
})