import React, { useEffect, useState } from 'react';
import { getProducers, deleteProducer } from '../services/api';

const AdminPage = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const data = await getProducers();
        setProducers(data);
      } catch (err) {
        setError('Erro ao carregar produtores.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  const handleDelete = async (producerId) => {
    try {
      await deleteProducer(producerId);
      setProducers(producers.filter(p => p._id !== producerId));
    } catch (err) {
      setError('Erro ao excluir produtor.');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Página do Administrador</h1>
      <h2>Lista de Produtores</h2>
      {producers.length > 0 ? (
        <ul>
          {producers.map(producer => (
            <li key={producer._id}>
              {producer.name} - {producer.email}
              <button onClick={() => handleDelete(producer._id)}>Excluir</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum produtor cadastrado.</p>
      )}
    </div>
  );
};

export default AdminPage;
