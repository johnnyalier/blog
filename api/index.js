import express from 'express';
import cors from 'cors';
import mongoose from'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use(cors());


mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to sudd-estate database')
    app.listen(PORT, () => {
        console.log(`Server listening at port ${PORT}`);
    })
})