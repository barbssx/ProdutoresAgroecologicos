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
  const { producerId } = req.params; // Mudança de 'id' para 'producerId'
  try {
    const producer = await Producer.findById(producerId).populate('products');
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
  const { producerId } = req.params; // Mudança de 'id' para 'producerId'
  try {
    const producer = await Producer.findById(producerId).populate('products');
    if (!producer) {
      return res.status(404).json({ message: 'Produtor não encontrado' });
    }
    res.status(200).json(producer.products);
  } catch (error) {
    console.error('Erro ao obter produtos do produtor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um produtor
const updateProducer = async (req, res) => {
  const { producerId } = req.params; // Mudança de 'id' para 'producerId'
  const updateData = req.body;

  try {
    const producer = await Producer.findById(producerId);
    if (!producer) {
      return res.status(404).json({ message: 'Produtor não encontrado' });
    }

    // Atualiza os dados do produtor
    Object.assign(producer, updateData);
    await producer.save();

    res.status(200).json({ message: 'Produtor atualizado com sucesso', producer });
  } catch (error) {
    console.error('Erro ao atualizar os dados do produtor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Excluir um produtor pelo ID
const deleteProducer = async (req, res) => {
  const { producerId } = req.params; // Mudança de 'id' para 'producerId'
  try {
    const producer = await Producer.findByIdAndDelete(producerId);
    if (!producer) {
      return res.status(404).json({ message: 'Produtor não encontrado' });
    }
    res.status(204).send(); 
  } catch (error) {
    console.error('Erro ao excluir o produtor:', error);
    res.status(500).json({ error: error.message });
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
    if (product.producer.toString() !== producerId && product.producer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este produto.' });
    }

    // Exclui o produto
    await Product.findByIdAndDelete(productId);
    res.status(204).send(); 
  } catch (error) {
    console.error('Erro ao deletar produto:', error.message);
    res.status(500).json({ error: error.message });
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
    if (product.producer.toString() !== producerId && product.producer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este produto.' });
    }

    // Atualiza os dados do produto
    Object.assign(product, updateData);
    await product.save();

    res.status(200).json({ message: 'Produto atualizado com sucesso', product });
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    res.status(500).json({ error: error.message });
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
