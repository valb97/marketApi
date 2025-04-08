import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js'
import initDB from './database/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoute);
app.use('/api', productRoute);
app.use('/api', userRoute);
app.use('/uploads', express.static('uploads'));

initDB().then((db) => {
    app.set('db', db);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error initializing database:', error);
}
);

app.get('/welcome', (req, res) => { 
    return res.json({ message: 'Welcome to the API' });
});