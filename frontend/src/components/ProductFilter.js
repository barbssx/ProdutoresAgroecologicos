// Filtrar produtos, permite que os usuários ajustem as opções de visualização com base em categorias como nome, preço, estação, etc.

import React, { useState } from 'react';

const ProductFilter = ({ categories, seasons, onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    season: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div>
      <h3>Filtrar Produtos</h3>
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
    </div>
  );
};

export default ProductFilter;
