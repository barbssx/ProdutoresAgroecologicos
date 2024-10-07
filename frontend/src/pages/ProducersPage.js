import React, { useEffect, useState } from 'react';
import { getProducers, getProductsByProducer } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProducersPage = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const data = await getProducers();
        // Para cada produtor, obtenha seus produtos e categorias
        const producersWithProducts = await Promise.all(data.map(async (producer) => {
          const products = await getProductsByProducer(producer._id);
          return { ...producer, products }; // Adiciona produtos ao objeto do produtor
        }));

        setProducers(producersWithProducts);
      } catch (err) {
        console.error('Erro ao carregar produtores:', err);
        setError('Erro ao carregar os produtores');
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Lista de Produtores</h1>
      {producers.length > 0 ? (
        producers.map(producer => (
          <div 
            key={producer._id} 
            onClick={() => navigate(`/producers/${producer._id}`)} 
            style={{ cursor: 'pointer', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}
          >
            <h3>{producer.name}</h3>
            <p>Email: {producer.email}</p>
            <p>Telefone: {producer.telefone || 'Não informado'}</p>
            <p>Endereço: {producer.localizacao || 'Não informado'}</p>
            {producer.products && producer.products.length > 0 && (
              <div>
                <h4>Categorias dos Produtos:</h4>
                <ul>
                  {producer.products.map(product => (
                    <li key={product._id}>{product.category}</li> // Exibe a categoria de cada produto
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Nenhum produtor cadastrado.</p>
      )}
    </div>
  );
};

export default ProducersPage;
