const jwt = require('jsonwebtoken');
const Producer = require('../models/Producer');

// Middleware para proteger rotas
const protect = async (req, res, next) => {
    let token;

    // Verifica se o token está presente no cabeçalho de autorização
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrai o token do cabeçalho
            token = req.headers.authorization.split(' ')[1];

            // Decodifica o token usando a chave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 

            // Busca o usuário no banco de dados e exclui a senha dos dados retornados
            req.user = await Producer.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Usuário não encontrado' });
            }

            console.log('Token recebido:', token);
            console.log('Dados decodificados:', decoded);
            console.log('Usuário encontrado:', req.user);

            next();
        } catch (error) {
            console.error('Erro ao validar token:', error);
            res.status(401).json({ message: 'Token inválido ou não autorizado' });
        }
    } else {
        res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

// Middleware para verificar se o usuário é um administrador
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado, somente administradores podem acessar.' });
    }
};

module.exports = { protect, admin };
