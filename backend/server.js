const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const producerRoutes = require('./routes/producerRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors'); 

dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();

// Domínios permitidos
const allowedOrigins = [
    'https://produtores-agroecologicos.vercel.app',
    'http://localhost:3000',
];

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Não autorizado por CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/producers', producerRoutes); 
app.use('/api/products', productRoutes);

// Tratamento de erros 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada', path: req.originalUrl });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
});

// Inicializa o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
