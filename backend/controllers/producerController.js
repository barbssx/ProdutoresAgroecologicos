const jwt = require('jsonwebtoken');
const Producer = require('../models/Producer');
const Product = require('../models/Product');

// Middleware de autenticação para decodificar o token e identificar o produtor
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Decodificar o token para obter o ID do produtor
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.producerId = decoded.id;

        // Buscar o produtor no banco de dados com base no ID decodificado
        const producer = await Producer.findById(req.producerId);

        if (!producer) {
            return res.status(404).json({ message: 'Produtor não encontrado.' });
        }

        // Adicionar os dados do produtor ao objeto de requisição
        req.producer = producer;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

// Registrar um novo produtor
const registerProducer = async (req, res) => {
    const { name, email, password, telefone, localizacao } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        const producerExists = await Producer.findOne({ email });
        if (producerExists) {
            return res.status(400).json({ message: 'Produtor já cadastrado com este email' });
        }

        const producer = new Producer({ name, email, password, telefone, localizacao });

        await producer.save();
        res.status(201).json({ message: 'Produtor registrado com sucesso', producer });
    } catch (error) {
        console.error('Erro ao registrar produtor:', error);
        res.status(500).json({ error: 'Erro ao registrar produtor', details: error.message });
    }
};

// Obter todos os produtores (excluindo administradores) e seus produtos
const getProducers = async (req, res) => {
    try {
        const producers = await Producer.find({ isAdmin: false }).populate('products');
        res.status(200).json(producers);
    } catch (error) {
        console.error('Erro ao obter produtores:', error);
        res.status(500).json({ error: 'Erro ao obter produtores', details: error.message });
    }
};

// Obter um produtor específico pelo ID (incluindo admin)
const getProducerById = async (req, res) => {
    const { producerId } = req.params; // 'producerId' vem da rota

    try {
        const producer = await Producer.findById(producerId).populate('products');

        if (!producer) {
            return res.status(404).json({ message: 'Produtor não encontrado.' });
        }

        // Permitir que o administrador veja seus próprios dados
        if (producer.isAdmin && producer._id.toString() !== req.producer._id.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para acessar os dados deste produtor.' });
        }

        res.status(200).json(producer);
    } catch (error) {
        console.error('Erro ao carregar o produtor:', error);
        res.status(500).json({ error: 'Erro ao carregar o produtor', details: error.message });
    }
};

// Adicionar produto ao produtor
const addProduct = async (req, res) => {
    const { producerId } = req.params;
    const productData = req.body;

    try {
        const producer = await Producer.findById(producerId).populate('products');

        if (!producer || producer.isAdmin) {
            return res.status(404).json({ message: 'Produtor não encontrado ou é um administrador' });
        }

        const product = new Product({ ...productData, producer: producerId });
        await product.save();

        producer.products.push(product._id);
        await producer.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ error: 'Erro ao adicionar produto', details: error.message });
    }
};

// Obter produtos de um produtor específico pelo ID
const getProductsByProducerId = async (req, res) => {
    const { producerId } = req.params;

    try {
        const producer = await Producer.findById(producerId).populate('products');
        if (!producer || producer.isAdmin) {
            return res.status(404).json({ message: 'Produtor não encontrado ou é um administrador' });
        }

        res.status(200).json(producer.products);
    } catch (error) {
        console.error('Erro ao obter produtos do produtor:', error);
        res.status(500).json({ error: 'Erro ao obter produtos do produtor', details: error.message });
    }
};

// Atualizar um produtor
const updateProducer = async (req, res) => {
    const { producerId } = req.params;
    const updateData = req.body;

    try {
        const producer = await Producer.findById(producerId);
        if (!producer || producer.isAdmin) {
            return res.status(404).json({ message: 'Produtor não encontrado ou é um administrador' });
        }

        Object.assign(producer, updateData);
        await producer.save();

        res.status(200).json({ message: 'Produtor atualizado com sucesso', producer });
    } catch (error) {
        console.error('Erro ao atualizar os dados do produtor:', error);
        res.status(500).json({ error: 'Erro ao atualizar os dados do produtor', details: error.message });
    }
};

// Excluir um produtor pelo ID
const deleteProducer = async (req, res) => {
    const { producerId } = req.params;

    try {
        const producer = await Producer.findByIdAndDelete(producerId);
        if (!producer || producer.isAdmin) {
            return res.status(404).json({ message: 'Produtor não encontrado ou é um administrador' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir o produtor:', error);
        res.status(500).json({ error: 'Erro ao excluir o produtor', details: error.message });
    }
};

// Excluir um Produto
const deleteProduct = async (req, res) => {
    const { producerId, productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        if (product.producer.toString() !== producerId) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este produto.' });
        }

        await Product.findByIdAndDelete(productId);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar produto:', error.message);
        res.status(500).json({ error: 'Erro ao deletar produto', details: error.message });
    }
};

// Atualizar um produto
const updateProduct = async (req, res) => {
    const { producerId, productId } = req.params;
    const updateData = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        if (product.producer.toString() !== producerId) {
            return res.status(403).json({ message: 'Você não tem permissão para atualizar este produto.' });
        }

        Object.assign(product, updateData);
        await product.save();

        res.status(200).json({ message: 'Produto atualizado com sucesso', product });
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar o produto', details: error.message });
    }
};

module.exports = {
    authMiddleware,
    registerProducer,
    getProducers,
    getProducerById,
    addProduct,
    getProductsByProducerId,
    updateProducer,
    deleteProducer,
    deleteProduct,
    updateProduct,
};
