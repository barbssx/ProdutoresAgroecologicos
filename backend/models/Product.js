const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  pricePerKg: { type: Number, required: true, min: [0, 'O preço por kg não pode ser negativo'] }, 
  biografia: { type: String, maxlength: 500 }, 
  available: { type: Boolean, default: true },
  season: { 
    type: String, 
    enum: ['Anual', 'Verão', 'Outono', 'Inverno', 'Primavera']
  }, 
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }, 
});

module.exports = mongoose.model('Product', productSchema);
