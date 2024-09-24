const Producer = require('../models/Producer');
const Product = require('../models/Product');

// Registrar um novo produtor
const registerProducer = async (req, res) => {
  const { name, email, password, telefone, localizacao } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o produtor já existe
    const producerExists = await Producer.findOne({ email });
    if (producerExists) {
      return res.status(400).json({ message: 'Produtor já cadastrado com este email' });
    }

    // Criar novo produtor
    const producer = new Producer({ name, email, password, telefone, localizacao });

    // Salvar no banco de dados
    await producer.save();
    res.status(201).json({ message: 'Produtor registrado com sucesso', producer });
  } catch (error) {
    console.error('Erro ao registrar produtor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obter todos os produtores (excluindo administradores) e seus produtos
const getProducers = async (req, res) => {
  try {
    const producers = await Producer.find({ isAdmin: false }).populate('products'); 
    res.status(200).json(producers);
  } catch (error) {
    console.error('Erro ao obter produtores:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obter um produtor específico pelo ID
const getProducerById = async (req, res) => {
  const { id } = req.params;
  try {
    const producer = await Producer.findById(id).populate('products');
    if (!producer) {
      return res.status(404).json({ message: 'Produtor não encontrado' });
    }
    res.status(200).json(producer);
  } catch (error) {
    console.error('Erro ao carregar o produtor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Adicionar produto ao produtor
const addProduct = async (req, res) => {
  const { producerId } = req.params; 
  const productData = req.body; 

  try {
    console.log("ID do produtor recebido:", producerId);
    const producer = await Producer.findById(producerId);
    
    if (!producer) {
      console.log("Produtor não encontrado:", producerId);
      return res.status(404).json({ message: 'Produtor não encontrado' });
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
    res.status(500).json({ error: error.message });
  }
};

// Obter produtos de um produtor específico pelo ID
const getProductsByProducerId = async (req, res) => {
  const { id } = req.params;
  try {
    const producer = await Producer.findById(id).populate('products');
    if (!producer) {
      return res.status(404).json({ message: 'Produtor não encontrado' });
    }
    res.status(200).json(producer.products);
  } catch (error) {
    console.error('Erro ao obter produtos do produtor:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  registerProducer, 
  getProducers, 
  getProducerById, 
  addProduct, 
  getProductsByProducerId
};
