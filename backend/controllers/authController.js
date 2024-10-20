const jwt = require('jsonwebtoken');
const Producer = require('../models/Producer');

// Função de login
const loginProducer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const producer = await Producer.findOne({ email });
        if (producer && (await producer.matchPassword(password))) { 
            const token = jwt.sign({ id: producer._id, isAdmin: producer.isAdmin }, process.env.JWT_SECRET, {
                expiresIn: '1d', 
            });

            return res.json({ token, id: producer._id });
        } else {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Função para registrar um novo produtor
const registerProducer = async (req, res) => {
    const { name, email, password, isAdmin } = req.body; 

    try {
        const producerExists = await Producer.findOne({ email });

        if (producerExists) {
            return res.status(400).json({ message: 'Produtor já existe' });
        }

        const producer = new Producer({
            name,
            email,
            password,
            isAdmin: isAdmin || false, 
        });

        await producer.save();
        res.status(201).json({ message: 'Produtor registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar produtor:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    loginProducer,
    registerProducer,
};
