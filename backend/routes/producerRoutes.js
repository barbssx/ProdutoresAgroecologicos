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

router.get('/', async (req, res) => {
    console.log("Requisitando todos os produtores");
    try {
        const producers = await Producer.find().populate('products');
        res.status(200).json(producers);
    } catch (error) {
        console.error('Erro ao obter produtores:', error.message);
        res.status(500).json({ message: 'Erro ao obter produtores.' });
    }
});

// Rota para obter um produtor pelo ID (qualquer usuário pode acessar)
router.get('/:producerId', async (req, res) => {
    console.log("Requisitando produtor com ID:", req.params.producerId);
    await getProducerById(req, res);
});

// Rota para obter produtos de um produtor pelo ID
router.get('/:producerId/products', async (req, res) => {
    console.log("Requisitando produtos do produtor com ID:", req.params.producerId);
    await getProductsByProducerId(req, res);
});

// Rotas relacionadas a produtos
const productRouter = express.Router({ mergeParams: true });

productRouter.post('/', protect, async (req, res) => {
    console.log("Tentativa de adicionar produto ao produtor com ID:", req.params.producerId, "com dados:", req.body);
    await addProduct(req, res);
});

productRouter.put('/:productId', protect, async (req, res) => {
    console.log("Tentativa de atualização do produto com ID:", req.params.productId, "do produtor com ID:", req.params.producerId);
    await updateProduct(req, res);
});

productRouter.delete('/:productId', protect, async (req, res) => {
    console.log("Tentativa de exclusão do produto com ID:", req.params.productId);
    await deleteProduct(req, res);
});

// Use o roteador de produtos
router.use('/:producerId/products', productRouter);

// Rota para atualizar um produtor (somente o produtor pode acessar)
router.put('/:producerId', protect, async (req, res) => {
    console.log("Tentativa de atualização do produtor com ID:", req.params.producerId);
    await updateProducer(req, res);
});

// Rota para excluir um produtor (apenas admin pode acessar)
router.delete('/:producerId', protect, admin, async (req, res) => {
    console.log("Tentativa de exclusão do produtor com ID:", req.params.producerId);
    await deleteProducer(req, res);
});

module.exports = router;
