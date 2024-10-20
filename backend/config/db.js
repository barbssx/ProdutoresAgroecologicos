const mongoose = require('mongoose');

// Usando as variáveis de ambiente
const mongoUser = process.env.MONGOUSER;
const mongoPassword = process.env.MONGOPASSWORD;
const mongoHost = process.env.MONGOHOST;
const mongoPort = process.env.MONGOPORT;
const databaseName = 'backend';

// Construindo a URL de conexão
const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${databaseName}`;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado ao MongoDB');
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
});
