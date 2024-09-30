// src/pages/ProducersPage.js
import React, { useEffect, useState } from 'react';
import { getProducers } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProducersPage = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const token = localStorage.getItem('token');

        // Verifica se o usuário está autenticado
        if (!token) {
          navigate('/login'); // Redireciona para a página de login se não estiver autenticado
          return;
        }

        const data = await getProducers();
        setProducers(data);
      } catch (err) {
        console.error('Erro ao carregar produtores:', err);
        setError('Erro ao carregar os produtores');
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, [navigate]); // Adiciona 'navigate' como dependência

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
          </div>
        ))
      ) : (
        <p>Nenhum produtor cadastrado.</p>
      )}
    </div>
  );
};

export default ProducersPage;
