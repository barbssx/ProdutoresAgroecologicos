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
router.get('/:producerId', async (req, res) => {
    console.log("Requisitando produtor com ID:", req.params.id);
    await getProducerById(req, res);
});

// Rota para obter produtos de um produtor pelo ID
router.get('/:id/products', async (req, res) => {
    console.log("Requisitando produtos do produtor com ID:", req.params.id);
    await getProductsByProducerId(req, res);
});

// Rota para adicionar um produto a um produtor específico
router.post('/:producerId/products', protect, async (req, res) => {
    console.log("Tentativa de adicionar produto ao produtor com ID:", req.params.producerId);
    await addProduct(req, res);
});

// Rota para atualizar um produtor (somente o produtor pode acessar)
router.put('/:producerId', protect, async (req, res) => {
    console.log("Tentativa de atualização do produtor com ID:", req.params.id);
    await updateProducer(req, res);
});

// Rota para excluir um produtor (apenas admin pode acessar)
router.delete('/:producerId', protect, admin, async (req, res) => {
    console.log("Tentativa de exclusão do produtor com ID:", req.params.id);
    await deleteProducer(req, res);
});

// Rota para excluir um produto de um produtor específico
router.delete('/:producerId/products/:productId', protect, async (req, res) => {
    console.log("Tentativa de exclusão do produto com ID:", req.params.productId);
    await deleteProduct(req, res);
});

// Rota para atualizar um produto de um produtor específico
router.put('/:producerId/products/:productId', protect, async (req, res) => {
    console.log("Tentativa de atualização do produto com ID:", req.params.productId, "do produtor com ID:", req.params.producerId);
    await updateProduct(req, res);
});

module.exports = router;
