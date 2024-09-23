const express = require('express');
const {
    registerProducer,
    getProducers,
    getProducerById,
    getProductsByProducerId
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
    console.log("Requisitando produtor com ID:", req.params.id);
    await getProducerById(req, res);
});

// Rota para obter produtos de um produtor pelo ID
router.get('/:id/products', async (req, res) => {
    console.log("Requisitando produtos do produtor com ID:", req.params.id);
    await getProductsByProducerId(req, res);
});

module.exports = router;
