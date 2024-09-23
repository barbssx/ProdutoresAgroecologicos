const Product = require('../models/Product');
const Producer = require('../models/Producer');

// Função para adicionar um novo produto
const addProduct = async (req, res) => {
    const { producerId } = req.params;

    // Verifica se o produtor no token é o mesmo do producerId
    if (req.user._id.toString() !== producerId) {
        return res.status(403).json({ message: 'Você não tem permissão para adicionar produtos a este produtor.' });
    }

    const { name, category, pricePerKg, season } = req.body;

    const newProduct = new Product({
        name,
        category,
        pricePerKg,
        season,
        producer: producerId,
    });

    try {
        const savedProduct = await newProduct.save();
        
        // Adiciona o novo produto ao array de produtos do produtor
        await Producer.findByIdAndUpdate(producerId, { $push: { products: savedProduct._id } });

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error.message);
        res.status(500).json({ message: 'Erro ao adicionar produto.' });
    }
};

// Função para atualizar um produto
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Verifica se o produtor é o mesmo que o autenticado
        if (product.producer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para editar este produto.' });
        }

        // Atualiza o produto
        Object.assign(product, req.body);
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
};

// Função para deletar um produto
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        
        if (product.producer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este produto.' });
        }

        await product.remove();
        res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error.message);
        res.status(500).json({ message: 'Erro ao deletar produto.' });
    }
};

module.exports = { addProduct, updateProduct, deleteProduct };
