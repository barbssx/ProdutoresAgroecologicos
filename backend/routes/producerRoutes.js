const express = require('express');
const {
    registerProducer,
    getProducers,
    getProducerById,
    getProductsByProducerId,
    addProduct,
    updateProducer,
    deleteProducer,
    deleteProduct,
    updateProduct
} = require('../controllers/producerController'); 
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para registrar um novo produtor (apenas admin pode acessar)
router.post('/', protect, admin, async (req, res) => {
    console.log("Tentativa de registro de produtor:", req.body);
    try {
        await registerProducer(req, res);
    } catch (error) {
        console.error('Erro ao registrar produtor:', error);
        res.status(500).json({ message: 'Erro ao registrar produtor' });
    }
});

// Rota para obter todos os produtores (qualquer usuário pode acessar)
router.get('/', async (req, res) => {
    console.log("Requisitando todos os produtores");
    try {
        await getProducers(req, res);
    } catch (error) {
        console.error('Erro ao obter produtores:', error);
        res.status(500).json({ message: 'Erro ao obter produtores' });
    }
});

// Rota para obter um produtor pelo ID (qualquer usuário pode acessar)
router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    console.log("Requisitando produtor com ID:", id);
    try {
        await getProducerById(req, res);
    } catch (error) {
        console.error(`Erro ao obter produtor com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao obter produtor' });
    }
});

// Rota para obter produtos de um produtor pelo ID
router.get('/:id/products', async (req, res) => {
    const { id } = req.params; 
    console.log("Requisitando produtos do produtor com ID:", id);
    try {
        await getProductsByProducerId(req, res);
    } catch (error) {
        console.error(`Erro ao obter produtos do produtor com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao obter produtos' });
    }
});

// Rota para adicionar um produto a um produtor específico
router.post('/:id/products', protect, async (req, res) => {
    const { id } = req.params; 
    console.log("Tentativa de adicionar produto ao produtor com ID:", id);
    try {
        await addProduct(req, res);
    } catch (error) {
        console.error(`Erro ao adicionar produto ao produtor com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao adicionar produto' });
    }
});

// Rota para atualizar um produtor (somente o produtor pode acessar)
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params; 
    console.log("Tentativa de atualização do produtor com ID:", id);
    try {
        await updateProducer(req, res);
    } catch (error) {
        console.error(`Erro ao atualizar produtor com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao atualizar produtor' });
    }
});

// Rota para excluir um produtor (apenas admin pode acessar)
router.delete('/:id', protect, admin, async (req, res) => {
    const { id } = req.params; 
    console.log("Tentativa de exclusão do produtor com ID:", id);
    try {
        await deleteProducer(req, res);
    } catch (error) {
        console.error(`Erro ao excluir produtor com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao excluir produtor' });
    }
});

// Rota para excluir um produto de um produtor específico
router.delete('/:id/products/:productId', protect, async (req, res) => {
    const { id, productId } = req.params; 
    console.log("Tentativa de exclusão do produto com ID:", productId, "do produtor com ID:", id);
    try {
        await deleteProduct(id, productId, req, res);
    } catch (error) {
        console.error(`Erro ao excluir produto com ID ${productId} do produtor com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao excluir produto' });
    }
});

// Rota para atualizar um produto de um produtor específico
router.put('/:id/products/:productId', protect, async (req, res) => {
    const { id, productId } = req.params; 
    console.log("Tentativa de atualização do produto com ID:", productId, "do produtor com ID:", id);
    try {
        await updateProduct(req, res);
    } catch (error) {
        console.error(`Erro ao atualizar produto com ID ${productId} do produtor com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
});

module.exports = router;
