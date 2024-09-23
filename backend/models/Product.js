const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome do produto (obrigatório)
  category: { type: String, required: true }, // Categoria do produto (obrigatório)
  pricePerKg: { type: Number, required: true, min: 0 }, // Preço por kg (obrigatório)
  available: { type: Boolean, default: true }, // Disponibilidade do produto
  season: { type: String }, // Estação em que o produto está disponível
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }, // Referência ao modelo do Produtor
});

module.exports = mongoose.model('Product', productSchema);
