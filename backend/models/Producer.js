const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const producerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /.+\@.+\..+/ // Validação simples de email
  },
  password: { type: String, required: true },
  telefone: { 
      type: String,
      match: /^\+?[1-9]\d{1,14}$/ // Validação para formato de telefone
  },
  localizacao: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isAdmin: { type: Boolean, default: false },
});

// Middleware para hash de senha antes de salvar
producerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar senhas
producerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para gerar o token JWT
producerSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Método para excluir a senha antes de enviar a resposta
producerSchema.methods.toJSON = function() {
    const producer = this;
    const producerObject = producer.toObject();
    
    // Remova a senha
    delete producerObject.password;

    return producerObject;
};

module.exports = mongoose.model('Producer', producerSchema);
