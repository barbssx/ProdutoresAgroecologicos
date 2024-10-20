const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

// Rota para cadastrar um novo produto para um produtor específico
router.post('/producers/:producerId/products', protect, addProduct); // Apenas produtores podem adicionar

// Rota para editar um produto
router.put('/producers/:producerId/products/:id', protect, updateProduct); 

// Rota para deletar um produto
router.delete('/producers/:producerId/products/:id', protect, deleteProduct); 

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
