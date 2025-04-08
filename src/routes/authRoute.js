import express from 'express';
import { generateToken, verifyToken } from '../middlewares/authMiddleware.js';
import initDB from '../database/database.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// No inicialices la BD globalmente, mejor hazlo en cada ruta

router.post('/register', async (req, res) => {
    try {
        const { username, password, name, email, phone, address } = req.body;
        const errors = [];

        const db = await initDB();
        
        const addressError = checkAddress(address);
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
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await initDB();
        
        // Buscamos al usuario en la base de datos por su nombre de usuario
        const user = await db.get(
            `SELECT * FROM users WHERE email = ?`,
            [username]
        );

        // Si no encontramos al usuario
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verificar la contraseña con bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generar el token con los datos del usuario
        const token = generateToken({ username: user.username });

        // Enviar los datos del usuario junto con el token
        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin : !!user.isAdmin
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        // Verifica si no se proporciona un token
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        } else {
            const db = await initDB();
            const expireAt = new Date(Date.now() + 60 * 60 * 1000); // El token se revocará dentro de 1 hora
            // Guarda el token revocado en la base de datos con su tiempo de expiración
            await db.run('INSERT INTO revoked_tokens (token, expires_at) VALUES (?, ?)', [token, expireAt]);
            res.status(200).json({ message: 'Logged out successfully' });
        }
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Funciones de validación
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

function checkAddress(address) {
    if (!address) {
        return "Please enter an address";
    }
    return null;
}

export default router;