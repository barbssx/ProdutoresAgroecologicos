const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const Product = require('../models/Product');

const router = express.Router();

// Rota para cadastrar um novo produto para um produtor específico
router.post('/producers/:producerId/products', protect, async (req, res) => {
    console.log(`Tentativa de adicionar produto ao produtor ID: ${req.params.producerId}`, req.body);
    await addProduct(req, res);
});

// Rota para editar um produto
router.put('/producers/:producerId/products/:id', protect, async (req, res) => {
    console.log(`Tentativa de editar produto ID: ${req.params.id} do produtor ID: ${req.params.producerId}`, req.body);
    await updateProduct(req, res); 
});

// Rota para deletar um produto
router.delete('/producers/:producerId/products/:id', protect, async (req, res) => {
    console.log(`Tentativa de deletar produto ID: ${req.params.id} do produtor ID: ${req.params.producerId}`);
    await deleteProduct(req, res); 
});

// Rota para obter todos os produtos de um produtor específico
router.get('/producers/:producerId/products', async (req, res) => { 
    console.log(`Requisitando produtos do produtor ID: ${req.params.producerId}`);
    try {
        const products = await Product.find({ producer: req.params.producerId });
        res.status(200).json(products);
    } catch (error) {
        console.error('Erro ao obter produtos do produtor:', error.message);
        res.status(500).json({ message: 'Erro ao obter produtos.' });
    }
});

module.exports = router;
