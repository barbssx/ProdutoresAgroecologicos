const Producer = require('../models/Producer');

// Registrar um novo produtor
const registerProducer = async (req, res) => {
  const { name, email, password } = req.body;

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Somente administradores podem registrar novos produtores.' });
  }

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const producer = new Producer({ name, email, password });
    await producer.save();
    res.status(201).json({ message: 'Produtor registrado com sucesso', producer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de um produtor
const loginProducer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const producer = await Producer.findOne({ email });
    if (!producer || !(await producer.matchPassword(password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = producer.getSignedJwtToken();
    res.status(200).json({ 
      producerId: producer._id, 
      token,
      isAdmin: producer.isAdmin 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerProducer, loginProducer };
