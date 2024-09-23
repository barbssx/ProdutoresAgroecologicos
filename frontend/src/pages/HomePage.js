//A página principal onde produtos e produtores devem ser exibidos para os visitantes.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducers } from '../services/api';
import ProducerProfile from '../components/ProducerProfile';
import ProductFilter from '../components/ProductFilter';

const HomePage = () => {
  const [producers, setProducers] = useState([]);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const navigate = useNavigate();

  const categories = ['vegetais', 'frutas', 'carnes', 'laticínios'];
  const seasons = ['verão', 'outono', 'inverno', 'primavera'];

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const data = await getProducers();
        console.log('Producers data:', data);
        setProducers(data);
        setFilteredProducers(data);
      } catch (err) {
        console.error('Erro ao carregar produtores:', err);
      }
    };

    fetchProducers();
  }, []);

  useEffect(() => {
    const filtered = producers.filter((producer) => {
      return (!selectedCategory || producer.products.some((product) => product.category === selectedCategory)) &&
             (!selectedSeason || producer.products.some((product) => product.season === selectedSeason));
    });
    setFilteredProducers(filtered);
  }, [selectedCategory, selectedSeason, producers]);

  const handleFilterChange = (filters) => {
    setSelectedCategory(filters.category || selectedCategory);
    setSelectedSeason(filters.season || selectedSeason);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <ProductFilter
        categories={categories}
        seasons={seasons}
        onFilterChange={handleFilterChange}
      />
      <div>
        {filteredProducers.length > 0 ? (
          filteredProducers.map((producer) => (
            <ProducerProfile 
              key={producer._id} 
              producer={producer} 
            />
          ))
        ) : (
          <p>Nenhum produtor encontrado com os filtros selecionados.</p>
        )}
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default HomePage;
