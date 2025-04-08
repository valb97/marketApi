import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import initDB from '../database/database.js';
import path from 'node:path';


const router = express.Router();

router.get('/userData/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params; 
    try {
        const db = await initDB();
        const query = `SELECT id, username, name, email, phone, address, created_at, updated_at FROM users WHERE id = ?`;
        const result = await db.get(query, [userId]); // `db.get()` obtiene una sola fila

        if (result) {
            res.status(200).json(result);
        } else {
            // Si no se encuentra al usuario, respondemos con un error
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        // Si ocurre algún error, respondemos con un error interno del servidor
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
});

router.get('/userData/isAdmin/:userId' ,verifyToken, async (req,res) => {
    const { userId } = req.params;
    try{
        const db = await initDB();
        const query = `SELECT isAdmin FROM users WHERE id = ?`;
        const result = await db.get(query, [userId]);
        if(result){
            res.status(200).json({ isAdmin: !!result.isAdmin }); // Convertir a booleano
        }else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }catch(error){
            console.error('Error al obtener los datos del usuario:', error);
            res.status(500).json({ message: 'Error al obtener los datos del usuario' });
        }
})


export default router;