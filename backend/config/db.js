const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_PUBLIC_URL;
        if (!uri) {
            throw new Error('MONGO_PUBLIC_URL não está definido no arquivo .env');
        }

        console.log('Tentando conectar ao MongoDB...');

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false 
        });

        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

// Para desconectar do banco de dados quando a aplicação for encerrada
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Conexão ao MongoDB encerrada.');
    process.exit(0);
});

module.exports = connectDB;
