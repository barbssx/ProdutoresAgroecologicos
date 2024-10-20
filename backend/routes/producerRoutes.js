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
    await registerProducer(req, res);
});

// Rota para obter todos os produtores (qualquer usuário pode acessar)
router.get('/', async (req, res) => {
    console.log("Requisitando todos os produtores");
    await getProducers(req, res);
});

// Rota para obter um produtor pelo ID (qualquer usuário pode acessar)
router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    console.log("Requisitando produtor com ID:", id);
    await getProducerById(req, res);
});

// Rota para obter produtos de um produtor pelo ID
router.get('/:id/products', async (req, res) => {
    const { id } = req.params; 
    console.log("Requisitando produtos do produtor com ID:", id);
    await getProductsByProducerId(req, res);
});

// Rota para adicionar um produto a um produtor específico
router.post('/:id/products', protect, async (req, res) => {
    const { id } = req.params; 
    console.log("Tentativa de adicionar produto ao produtor com ID:", id);
    await addProduct(req, res);
});

// Rota para atualizar um produtor (somente o produtor pode acessar)
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params; 
    console.log("Tentativa de atualização do produtor com ID:", id);
    await updateProducer(req, res);
});

// Rota para excluir um produtor (apenas admin pode acessar)
router.delete('/:id', protect, admin, async (req, res) => {
    const { id } = req.params; 
    console.log("Tentativa de exclusão do produtor com ID:", id);
    await deleteProducer(req, res);
});

// Rota para excluir um produto de um produtor específico
router.delete('/:id/products/:productId', protect, async (req, res) => {
    const { id, productId } = req.params; 
    console.log("Tentativa de exclusão do produto com ID:", productId, "do produtor com ID:", id);
    await deleteProduct(id, productId, req, res);
});

// Rota para atualizar um produto de um produtor específico
router.put('/:id/products/:productId', protect, async (req, res) => {
    const { id, productId } = req.params; 
    console.log("Tentativa de atualização do produto com ID:", productId, "do produtor com ID:", id);
    await updateProduct(req, res);
});

module.exports = router;
