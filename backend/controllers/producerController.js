const Producer = require('../models/Producer');
const Product = require('../models/Product');

// Registrar um novo produtor
const registerProducer = async (req, res) => {
    const { name, email, password, telefone, localizacao, isAdmin = false } = req.body;

    try {
        // Validação dos dados de entrada
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Verificar se o produtor já existe
        const producerExists = await Producer.findOne({ email });
        if (producerExists) {
            return res.status(400).json({ message: 'Produtor já cadastrado com este email' });
        }

        // Criar novo produtor
        const producer = new Producer({ name, email, password, telefone, localizacao, isAdmin });

        // Salvar no banco de dados
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
        console.log('Produtores encontrados:', producers); 
        res.status(200).json(producers);
    } catch (error) {
        console.error('Erro ao obter produtores:', error);
        res.status(500).json({ error: 'Erro ao obter produtores', details: error.message });
    }
};

// Obter um produtor específico pelo ID
const getProducerById = async (req, res) => {
    const { producerId } = req.params;
    try {
        const producer = await Producer.findById(producerId).populate('products');
        
        // Permitir que o administrador veja seu próprio perfil
        if (!producer || (producer.isAdmin && producer._id.toString() !== req.user._id.toString())) {
            return res.status(404).json({ message: 'Produtor não encontrado ou é um administrador' });
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
        console.log("ID do produtor recebido:", producerId);
        const producer = await Producer.findById(producerId).populate('products');

        if (!producer || producer.isAdmin) {
            console.log("Produtor não encontrado ou é admin:", producerId);
            return res.status(404).json({ message: 'Produtor não encontrado ou é um administrador' });
        }

        // Criar e salvar o produto
        const product = new Product({ ...productData, producer: producerId });
        await product.save();

        // Adicionar produto à lista de produtos do produtor
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

        // Atualiza os dados do produtor
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

// Função para Excluir um Produto
const deleteProduct = async (req, res) => {
    const { producerId, productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Verifica se o produto pertence ao produtor autenticado
        if (product.producer.toString() !== producerId) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este produto.' });
        }

        // Exclui o produto
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

        // Verifica se o produto pertence ao produtor autenticado
        if (product.producer.toString() !== producerId) {
            return res.status(403).json({ message: 'Você não tem permissão para atualizar este produto.' });
        }

        // Atualiza os dados do produto
        Object.assign(product, updateData);
        await product.save();

        res.status(200).json({ message: 'Produto atualizado com sucesso', product });
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar o produto', details: error.message });
    }
};

module.exports = {
    registerProducer,
    getProducers,
    getProducerById,
    addProduct,
    getProductsByProducerId,
    updateProducer,
    deleteProducer,
    deleteProduct,
    updateProduct
};
