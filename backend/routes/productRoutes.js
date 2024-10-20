const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const Product = require('../models/Product');

const router = express.Router();

// Rota para cadastrar um novo produto para um produtor específico
router.post('/producers/:producerId/products', protect, async (req, res) => {
    try {
        await addProduct(req, res); // Apenas produtores podem adicionar
    } catch (error) {
        console.error('Erro ao adicionar produto:', error.message);
        res.status(500).json({ message: 'Erro ao adicionar produto.' });
    }
});

// Rota para editar um produto
router.put('/producers/:producerId/products/:id', protect, async (req, res) => {
    try {
        await updateProduct(req, res);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
});

// Rota para deletar um produto
router.delete('/producers/:producerId/products/:id', protect, async (req, res) => {
    try {
        await deleteProduct(req, res);
    } catch (error) {
        console.error('Erro ao deletar produto:', error.message);
        res.status(500).json({ message: 'Erro ao deletar produto.' });
    }
});

// Rota para obter todos os produtos de um produtor específico
router.get('/producers/:producerId/products', async (req, res) => {
    try {
        const products = await Product.find({ producer: req.params.producerId });
        res.status(200).json(products);
    } catch (error) {
        console.error('Erro ao obter produtos do produtor:', error.message);
        res.status(500).json({ message: 'Erro ao obter produtos.' });
    }
});

module.exports = router;
