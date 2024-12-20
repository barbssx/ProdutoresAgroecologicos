import React, { useEffect, useState } from 'react';
import { getProducers, getProductsByProducer } from '../services/api';
import './ProducersPage.css';
import ProductFilter from '../components/ProductFilter';
import SeasonChip from '../components/SeasonChip';

const ProducersPage = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [filters, setFilters] = useState({ category: '', season: '' });

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const data = await getProducers();
        const filteredData = data.filter(producer => !producer.isAdmin); 

        const producersWithProducts = await Promise.all(
          filteredData.map(async (producer) => {
            try {
              const products = await getProductsByProducer(producer._id);
              return { ...producer, products: products || [] };
            } catch (err) {
              console.error(`Erro ao carregar produtos para o produtor ${producer.name}:`, err);
              return { ...producer, products: [] };
            }
          })
        );
        setProducers(producersWithProducts);
        setFilteredProducers(producersWithProducts);
      } catch (err) {
        console.error('Erro ao carregar produtores:', err);
        setError('Erro ao carregar os produtores');
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  const handleProducerClick = (producer) => {
    setSelectedProducer(producer);
  };

  const handleCloseModal = () => {
    setSelectedProducer(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    const filtered = producers.map((producer) => {
      // Filtrar os produtos do produtor de acordo com os filtros
      const filteredProducts = producer.products.filter((product) => {
        const matchesCategory = newFilters.category ? product.category === newFilters.category : true;
        const matchesSeason = newFilters.season ? product.season.includes(newFilters.season) : true;

        return matchesCategory && matchesSeason;
      });

      // Retorna o produtor apenas com os produtos filtrados
      return { ...producer, products: filteredProducts };
    }).filter(producer => producer.products.length > 0); 

    setFilteredProducers(filtered);
  };

  const filteredProductsForPopup = selectedProducer
    ? selectedProducer.products.filter((product) => {
        const matchesCategory = filters.category ? product.category === filters.category : true;
        const matchesSeason = filters.season ? product.season.includes(filters.season) : true;

        return matchesCategory && matchesSeason;
      })
    : [];

  if (loading) return <p className="jersey-15-regular">Carregando produtores e produtos, por favor aguarde...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="producer-page">
      <h1 className="jersey-15-charted-regular">Catálogo de Produtores</h1>

      {/* Filtro */}
      <ProductFilter
        categories={[...new Set(producers.flatMap((p) => p.products.map((product) => product.category)))]}
        seasons={['Anual', 'Verão', 'Outono', 'Inverno', 'Primavera']}
        onFilterChange={handleFilterChange}
      />

      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <img src="/assets/plants.gif" alt="Plants" style={{ width: '120px', borderRadius: '5px' }} />
      </div>

      {filteredProducers.length > 0 ? (
        filteredProducers.map((producer) => (
          <div key={producer._id} onClick={() => handleProducerClick(producer)} className="producer-card">
            <h3 className="jersey-15-charted-regular">{producer.name}</h3>
            <p className="jersey-15-regular"><strong>E-mail: </strong>{producer.email || 'Não informado'}</p>
            <p className="jersey-15-regular"><strong>Telefone:</strong>{producer.telefone || 'Não informado'}</p>
            <p className="jersey-15-regular"><strong>Endereço:</strong> {producer.localizacao || 'Não informado'}</p>
            <p className="jersey-15-regular"><strong>Biografia:</strong> {producer.biografia || 'Não informado'}</p>

            {producer.products.length > 0 ? (
              <div className="product-list">
                {producer.products.map((product) => (
                  <div key={product._id} className="product-item">
                    <span className={`category ${product.category.replace(/\s+/g, '-').toLowerCase()}`}>
                      {product.category}
                    </span>
                    <p className="jersey-15-regular">
                      <strong>{product.name}</strong> <br /><br />
                      Preço {product.pricePerKg} R$ por {product.unit} <br /><br />
                      Estação: {product.season.map(season => (
                        <SeasonChip key={season} season={season} />
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="jersey-15-regular">Nenhum produto cadastrado.</p>
            )}
          </div>
        ))
      ) : (
        <p className="jersey-15-regular">Nenhum produtor cadastrado.</p>
      )}

{selectedProducer && (
    <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="jersey-15-charted-regular">{selectedProducer.name}</h2>
            <p className="jersey-15-regular">Email: {selectedProducer.email}</p>
            <p className="jersey-15-regular">Telefone: {selectedProducer.telefone || 'Não informado'}</p>
            <p className="jersey-15-regular">Endereço: {selectedProducer.localizacao || 'Não informado'}</p>
            <h3 className="jersey-15-regular">Produtos:</h3>
            <ul className="product-list">
                {filteredProductsForPopup.length > 0 ? (
                    filteredProductsForPopup.map((product) => (
                        <li key={product._id} className="jersey-15-regular produto-modal">
                            <strong>{product.name}</strong> - Preço {product.pricePerKg} R$ por {product.unit} - Estação: {product.season.join(', ')}
                        </li>
                    ))
                ) : (
                    <p className="jersey-15-regular">Nenhum produto disponível para este produtor.</p>
                )}
            </ul>
            <button onClick={handleCloseModal}>Fechar</button>
        </div>
    </div>
)}
    </div>
  );
};

export default ProducersPage;
