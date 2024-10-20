const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Producer = require('../models/Producer');

// Função de login
const loginProducer = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar se o produtor existe
        const producer = await Producer.findOne({ email });
        if (!producer) {
            return res.status(401).json({ message: 'Produtor não encontrado' });
        }

        // Verificar se a senha está correta
        if (await producer.matchPassword(password)) {
            // Gerar um token JWT
            const token = jwt.sign(
                { id: producer._id, isAdmin: producer.isAdmin }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' } 
            );

            // Retornar o token, ID do produtor e a URL do produtor
            return res.json({ 
                token, 
                producerId: producer._id, 
                producerUrl: `/producers/${producer._id}`
            });
        } else {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro ao autenticar produtor:', error);
        return res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

// Função para registrar um novo produtor
const registerProducer = async (req, res) => {
    // Validação dos dados de entrada
    await body('name').notEmpty().withMessage('Nome é obrigatório').run(req);
    await body('email').isEmail().withMessage('Email inválido').run(req);
    await body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres').run(req);
    await body('isAdmin').optional().isBoolean().withMessage('isAdmin deve ser um booleano').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, isAdmin } = req.body;
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
        return res.status(201).json({ message: 'Produtor registrado com sucesso' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

module.exports = {
    loginProducer,
    registerProducer,
};
