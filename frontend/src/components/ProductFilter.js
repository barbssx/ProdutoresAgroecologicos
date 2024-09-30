import React, { useState } from 'react';

const ProductFilter = ({ categories, seasons, onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    season: '',
    name: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    
    // Verifica se os campos minPrice e maxPrice são válidos
    if (name === 'minPrice' || name === 'maxPrice') {
      const { minPrice, maxPrice } = updatedFilters;
      if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
        alert("O preço mínimo não pode ser maior que o preço máximo.");
        return;
      }
    }

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div>
      <h3>Filtrar Produtos</h3>
      <div>
        <label>Nome do Produto:</label>
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Categoria:</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Estação:</label>
        <select name="season" value={filters.season} onChange={handleChange}>
          <option value="">Todas</option>
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Preço Mínimo:</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Preço Máximo:</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ProductFilter;
