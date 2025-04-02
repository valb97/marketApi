import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/products', verifyToken, (req, res) => {
    return json({
        products: ['Paper', 'Pencil', 'Eraser', 'Sharpener'],
    })
})

router.post('/products', verifyToken, (req, res) => {
    const { name, category, price, stock, description, image } = req.body;
    db.addProduct({ name, category, price, stock, description, image });
    res.status(201).json({ message: 'Product added successfully' });
})

export default router;