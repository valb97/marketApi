import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();


export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

export const verifyToken = (req, res, next) => {
    const authHeader = req.header['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied by the server' });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    })
};

