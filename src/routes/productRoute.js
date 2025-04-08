import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import initDB from '../database/database.js';
import { upload } from '../controllers/upload.js';


const router = express.Router();

router.get('/products',async (req, res) => {
    try {
        const db = await initDB();
        const query = "SELECT id, name, category, price, stock, description, image FROM products";
        const result = await db.all(query); // <- corregido con await
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'No hay productos disponibles' });
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

router.get('/products/:id', async (req,res) => {
    const id = req.params.id;
    console.log(id);
    try{
        const db = await initDB();
        const query = "SELECT id,name,category,price,stock,description,image FROM products WHERE id = ?";
        const result = await db.get(query,[id]);
        if (result) {
            console.log(result);
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Item no encontrado' });
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al obtener el producto' }); 
    }
})

router.post('/products/details', async (req, res) => {
    console.log('Request received at /api/products/details');
    console.log('Request body:', req.body);
    
    const { ids } = req.body; 
    console.log('IDs extracted:', ids);
    
    if (!ids || ids.length === 0) {
        console.log('No IDs provided, returning 400');
        return res.status(400).json({ message: 'No se han proporcionado IDs' });
    }

    try {
        const db = await initDB();
        
        // Convert the array to a string for SQLite's IN clause
        const placeholders = ids.map(() => '?').join(',');
        const query = `SELECT id, name, category, price, stock, description, image FROM products WHERE id IN (${placeholders})`;
        
        console.log('Executing query:', query);
        console.log('With parameters:', ids);
        
        const result = await db.all(query, ids);
        console.log('Query result:', result);
        
        if (result.length > 0) {
            console.log('Returning products:', result);
            res.status(200).json(result);
        } else {
            console.log('No products found, returning 404');
            res.status(404).json({ message: 'No se encontraron productos con los IDs proporcionados' });
        }
    } catch (error) {
        console.error('Error in /products/details route:', error);
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
});



router.post('/products', verifyToken, upload.single('image'), async (req, res) => {
    const { name, category, price, stock, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const db = await initDB(); // OJO: te faltaba el `await` también

    try {
        await db.run(
            `INSERT INTO products (name, category, price, stock, description, image)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, category, price, stock, description, image]
        );
        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (err) {
        console.error('Error al agregar producto:', err);
        res.status(500).json({ message: 'Error al agregar el producto' });
    }
});

export default router;

// router.post('/products', verifyToken, (req, res) => {
//     const { name, category, price, stock, description, image } = req.body;
//     db.addProduct({ name, category, price, stock, description, image });
//     res.status(201).json({ message: 'Product added successfully' });
// })