import express from 'express';
import { generateToken } from '../middlewares/authMiddleware.js';
import initDB from '../database/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const {userName, password} = req.body;
    const db = await initDB();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [userName]);
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [userName, password]);
    res.status(201).json({ message: 'User registered successfully' });  
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const token = generateToken({ username });
        res.status(200).json({ token });
    }
    else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
})

router.post('/logout', async (req, res) => {
    // Get token from the client request
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        } else {
            const db = await initDB();
            const expireAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
            await db.run('INSERT INTO revoked_tokens (token, expires_at) VALUES (?, ?)', [token, expireAt]);
            res.status(200).json({ message: 'Logged out successfully' });
        }
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default router; 