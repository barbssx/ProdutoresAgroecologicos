import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ categories, seasons, onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    season: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="">Todas as Categorias</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select name="season" value={filters.season} onChange={handleChange}>
        <option value="">Todas as Estações</option>
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilter;
