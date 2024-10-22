const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  pricePerKg: { type: Number, required: true, min: [0, 'O preço não pode ser negativo'] },
  unit: { 
    type: String,
    enum: ['KG','L','UN'],
    required: true
  },
  biografia: { type: String, maxlength: 500 }, 
  available: { type: Boolean, default: true },
  season: { 
    type: [String],
    enum: ['Anual', 'Verão', 'Outono', 'Inverno', 'Primavera'],
    required: true,
    validate: {
      validator: function(value) {
        return value.length > 0;
      },
      message: 'Pelo menos uma estação deve ser selecionada.',
    },
  }, 
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }, 
});

module.exports = mongoose.model('Product', productSchema);
