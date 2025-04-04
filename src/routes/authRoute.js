import express from 'express';
import { generateToken } from '../middlewares/authMiddleware.js';
import initDB from '../database/database.js';
import bcrypt from 'bcrypt';

async function checkUsername(db, username) {
    if (!username) {
        return "Please enter a username";
    }
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
        return "Username already exists";
    }
    return null;
}

async function checkEmail(db, email) {
    if (!email) {
        return "Please enter an email";
    }
    const existingEmail = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingEmail) {
        return "Email already exists";
    }
    return null;
}

async function checkPhone(db, phone) {
    if (!phone) {
        return "Please enter a phone number";
    }
    const existingPhone = await db.get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (existingPhone) {
        return "Phone number already exists";
    }
    return null;
}

function checkName(name) {
    if (!name) {
        return "Please enter a name";
    }
    return null;
}

function checkAddres(address) {
    if (!address) {
        return "Please enter an address";
    }
    return null;
}

const router = express.Router();

router.post('/register', async (req, res) => {

    const { username, password, name, email, phone, address } = req.body;
    const errors = [];

    const db = await initDB();
    const addressError = checkAddres(address);
    if (addressError) { errors.push(addressError); }

    const nameError = checkName(name);
    if (nameError) { errors.push(nameError); }
    
    const usernameError = await checkUsername(db, username);
    if (usernameError) errors.push(usernameError);

    const emailError = await checkEmail(db, email);
    if (emailError) errors.push(emailError);

    const phoneError = await checkPhone(db, phone);
    if (phoneError) errors.push(phoneError);


    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
        'INSERT INTO users (username, password, name, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [username, hashedPassword, name, email, phone, address]
    );


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